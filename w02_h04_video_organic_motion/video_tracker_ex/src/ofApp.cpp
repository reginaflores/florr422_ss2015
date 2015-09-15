#include "ofApp.h"



//--------------------------------------------------------------
void ofApp::setup(){
    
    myVid.loadMovie("shader_studio_small.mp4");
    myVid.play();
    myVid.setLoopState(OF_LOOP_NORMAL);
    myVid.setSpeed(0.5);
    
}

//--------------------------------------------------------------
void ofApp::update(){
    
    myVid.update();
    
    if(myVid.isFrameNew()){
        flow.calcOpticalFlow(myVid);
    }


}

//--------------------------------------------------------------
void ofApp::draw(){
    
    ofSetColor(255);
    myVid.draw(0,0);

    vector<ofPoint> keypoints = flow.getCurrent();
    for (int i=0; i<keypoints.size(); i++) {
        ofSetColor(255, 0, 0);
        ofCircle(keypoints[i].x, keypoints[i].y, 5);
        points.push_back(keypoints[i]);
    }
    
    ofBeginShape();
    ofSetColor(255);
    ofNoFill();
    for(int i = 0; i < points.size(); i++){
        ofVertex(points[i].x, points[i].y);
    }
    ofEndShape();

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
    points.clear();
    vector<KeyPoint> keypoints;
    vector<KeyPoint> keypointsInside;
    vector<cv::Point2f> featuresToTrack;
    copyGray(myVid, myVidGray);
    FAST(myVidGray,keypoints,2);
    KeyPoint k(Point2f(x, y), 2);
    keypointsInside.push_back(k);
    KeyPoint::convert(keypointsInside,featuresToTrack);
    flow.setFeaturesToTrack(featuresToTrack);
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
