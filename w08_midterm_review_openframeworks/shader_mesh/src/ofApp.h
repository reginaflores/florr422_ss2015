#pragma once

#include "ofMain.h"
#include "ofxUI.h"

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();

		void keyPressed(int key);
		void keyReleased(int key);
		void mouseMoved(int x, int y );
		void mouseDragged(int x, int y, int button);
		void mousePressed(int x, int y, int button);
		void mouseReleased(int x, int y, int button);
		void windowResized(int w, int h);
		void dragEvent(ofDragInfo dragInfo);
		void gotMessage(ofMessage msg);
        void guiEvent(ofxUIEventArgs &e);

    
    
    ofMesh myMesh;
    ofLight light;
    
    void setNormals(ofMesh &mesh);
    
    //grid variables
    int gridWidth;
    int gridHeight;
    
    //
    float time;
    float angle;
    
    int numVert;
    int numTri;
    
    ofPoint dir;
    
    int i1;
    int i2;
    int i3;
    int i4;
    
    int index;
    float value;
    
    int radius;
    int noiseRadius;
    float theta;
    float phi;
    
    float x;
    float y;
    float z;
    
    ofEasyCam cam;
    
    ofShader shader;
    
    ofSoundPlayer 		sound;
    
    ofxUICanvas *gui;
    int mouseFactor;
    bool colorOn;
    



};
