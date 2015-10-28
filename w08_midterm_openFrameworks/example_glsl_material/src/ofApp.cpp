#include "ofApp.h"

void ofApp::setup(){
    ofSetFrameRate(60);
    w=ofGetScreenWidth();
    h=ofGetScreenHeight();
    
    imgcapsule="images/skin2.jpg";/* image base shader */
    imgcapsule="images/skin3.jpg";/* image double reflect */
    model.loadModel("models/alduin.obj",true);
    
    materiale.initMaterial(0,materiale.GENERIC,imgcapsule,"");
    int numMatShader = materiale.getNumMaterial();
    
    gui.setup();
    gui.add(selectIndex.set("select generic material",1,1,numMatShader));
    gui.add(maxh.set("max height noise",0.f,0.f,30.f));
    gui.add(timechange.set("effect time",true));
    gui.add(sliderTime.set("effect slide",0.,0.,10.));
    gui.add(noisestop.set("noise stop",false));
    gui.add(disturbo.set("disturbo",0,0,255));
    
    gui.add(label.set("other material",""));
    gui.add(double_reflect.set("double reflect",false));
    gui.add(light_reflect.set("light reflect",false));
    gui.add(simple_reflect.set("simple reflect",false));
    gui.add(normal_map.set("normal map",false));
    
    gui.add(bg.set("background",ofColor(10,10,140),ofColor(0,0),ofColor(255,255)));
    gui.setPosition(ofPoint(255,155,0));
    
    selectIndex.addListener(this, &ofApp::selectMaterial);
    double_reflect.addListener(this, &ofApp::doubleRef);
    light_reflect.addListener(this, &ofApp::lightRef);
    simple_reflect.addListener(this, &ofApp::simpleRef);
    normal_map.addListener(this, &ofApp::normalMap);
    
    shader.load("patterns.vert", "triangle_wall_shadow.frag");

}

void ofApp::doubleRef(bool & value){
    materiale.initMaterial(0,materiale.REFLECT_3,imgcapsule,imgcapsule2);
}

void ofApp::lightRef(bool & value){
    materiale.initMaterial(0,materiale.REFLECT_2,imgcapsule,"");
}

void ofApp::simpleRef(bool & value){
    materiale.initMaterial(0,materiale.REFLECT_1,imgcapsule,"");
}

void ofApp::normalMap(bool & value){
    materiale.initMaterial(0,materiale.NORMALMAP,"","");
}

void ofApp::selectMaterial(int & value){
    materiale.initMaterial(value,materiale.GENERIC,imgcapsule,"");/*value da 1 a getNumMaterial()*/
}

void ofApp::update(){
    ofSetWindowTitle(ofToString(ofGetFrameRate()));
}

void ofApp::draw(){
    ofBackground(bg);
    
    
    float time;
    if(timechange){
        time=sliderTime;
    }
    else{
        time=ofGetElapsedTimef();
    }
    
    materiale.begin(&cam,materiale.getColorPicker(),time,maxh,noisestop,disturbo);
    cam.begin();
    shader.begin();
    shader.setUniform2f("u_resolution", ofGetWidth(), ofGetHeight());
    shader.setUniform1f("u_time", ofGetElapsedTimef());
    ofSetColor(255,124,34);
    model.drawFaces();
    shader.end();
    cam.end();
    materiale.end();
    
    if(hide){
        materiale.drawPicker();
        materiale.getNoiseMap().draw(255,0);
        gui.draw();
    }
}

void ofApp::keyPressed(int key){
    if(key == 'q')
        cam.disableMouseInput();
    if(key == 'w')
        cam.enableMouseInput();
    if(key == 'f')
        ofToggleFullscreen();
    if(key == ' ')
        hide=!hide;
}
