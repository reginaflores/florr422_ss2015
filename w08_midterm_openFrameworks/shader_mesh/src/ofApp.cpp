#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){

    ofEnableSmoothing();
    
    gridWidth = 200;
    gridHeight = 200;
    
    //set initial conditions for spherical coordinates
    radius = 250;
    theta = 0;
    phi = 0;
    
    // set up the vertices and colors
    //first on the y axis
    for(int j = 0; j < gridHeight; j++){
        //now on the x axis
        for(int i = 0; i < gridWidth; i++){
            //spherical coordinates for x, y, z
            //theta (0,2pi) -- goes around world
            //phi (0,pi) -- goes from one pole to next pole
            
            //note we make gridHeight-1 to close the "slice" and try to make the sphere continuous
            //we still have a gap but that is because the noise value at Pi is not the same as noise value at 0
            
            phi = ofMap(j, 0, gridHeight-1,0,PI);
            theta = ofMap(i, 0, gridWidth-1, 0, 2*PI);
            noiseRadius = radius + (ofNoise(phi, theta)*100);
            
            x = noiseRadius*cos(theta)*sin(phi);
            y = noiseRadius*sin(theta)*sin(phi);
            z = noiseRadius*cos(phi);
            
            myMesh.addVertex(ofPoint(x,y,z));
            myMesh.addColor(ofColor(0,0,0));
        }
    }
    
    // set up triangles indices
    //first on the y axis
    for(int y = 0; y < gridWidth-1; y++){
        //now on the x axis
        for(int x = 0; x < gridHeight-1; x++){
            i1 = x + gridWidth * y;
            i2 = x+1 + gridWidth * y;
            i3 = x + gridWidth * (y+1);
            i4 = x+1 + gridWidth * (y+1);
            myMesh.addTriangle( i1, i2, i3);
            myMesh.addTriangle( i2, i4, i3);
        }
    }
    setNormals(myMesh);
    myLight.enable();
    
    shader.load("patterns.vert", "triangle_wall_shadow.frag");
}

//--------------------------------------------------------------
void ofApp::update(){
    float time = ofGetElapsedTimef();	//Get time
    //Change vertices
    for (int j=0; j<gridHeight; j++) {
        for (int i=0; i<gridWidth; i++) {
            int index = i + gridWidth * j;			//Vertex index
            ofPoint p = myMesh.getVertex( index );
            
            //Get Perlin noise value
            float value = ofNoise( x * 0.05, y * 0.05, time * 0.5 );
            
            //Change z-coordinate of vertex
            //p.z = value * 100;
            //myMesh.setVertex(i, p);
            
            phi = ofMap(j, 0, gridHeight-1,0,PI);
            theta = ofMap(i, 0, gridWidth-1, 0, 2*PI);
            //make noise a function of time to make sphere move
            noiseRadius = radius + (ofNoise(phi*mouseY/200.0, theta*mouseY/200.0, ofGetFrameNum()*0.01)*mouseX);
            
            x = noiseRadius*cos(theta)*sin(phi);
            y = noiseRadius*sin(theta)*sin(phi);
            z = noiseRadius*cos(phi);
            
            myMesh.setVertex(index, ofPoint(x,y,z));
            
            //Change color of vertex
            myMesh.setColor( index, ofColor( value*255, value , 155 ) );
        }
    }
    setNormals( myMesh );	//Update the normals


}

//--------------------------------------------------------------
void ofApp::draw(){

    ofBackground(255);
    cam.begin();
    shader.begin();
    
    ofEnableDepthTest();				//Enable z-buffering
    
    shader.setUniform2f("u_resolution", ofGetWidth(), ofGetHeight());
    shader.setUniform1f("u_time", ofGetElapsedTimef());
    
    //Calculate the rotation angle
    float time = ofGetElapsedTimef();   //Get time in seconds
    float angle = time * 20;			//Compute angle. We rotate at speed
    
    //Draw mesh
    //Here ofSetColor() does not affects the result of drawing,
    //because the mesh has its own vertices' colors
    myMesh.draw();

    shader.end();
    cam.end();
    
    

}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}
//Universal function which sets normals for the triangle mesh
void ofApp::setNormals(ofMesh &mesh){
    
    //The number of the vertices
    int nV = mesh.getNumVertices();
    
    //The number of the triangles
    int nT = mesh.getNumIndices() / 3;
    
    vector<ofPoint> norm( nV ); //Array for the normals
    
    //Scan all the triangles. For each triangle add its
    //normal to norm's vectors of triangle's vertices
    for (int t=0; t<nT; t++) {
        
        //Get indices of the triangle t
        int i1 = mesh.getIndex( 3 * t );
        int i2 = mesh.getIndex( 3 * t + 1 );
        int i3 = mesh.getIndex( 3 * t + 2 );
        
        //Get vertices of the triangle
        const ofPoint &v1 = mesh.getVertex( i1 );
        const ofPoint &v2 = mesh.getVertex( i2 );
        const ofPoint &v3 = mesh.getVertex( i3 );
        
        //Compute the triangle's normal
        ofPoint dir = ( (v2 - v1).crossed( v3 - v1 ) ).normalized();
        
        //Accumulate it to norm array for i1, i2, i3
        norm[ i1 ] += dir;
        norm[ i2 ] += dir;
        norm[ i3 ] += dir;
    }
    
    //Normalize the normal's length
    for (int i=0; i<nV; i++) {
        norm[i].normalize();
    }
    
    //Set the normals to mesh
    mesh.clearNormals();
    mesh.addNormals( norm );
}

