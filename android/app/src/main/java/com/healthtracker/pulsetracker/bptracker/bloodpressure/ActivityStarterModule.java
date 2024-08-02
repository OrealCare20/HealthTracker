package com.healthtracker.pulsetracker.bptracker.bloodpressure;

import android.content.Intent;
import android.app.Activity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ActivityStarterModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    ActivityStarterModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "ActivityStarter";
    }

    @ReactMethod
    public void startActivity() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            Intent intent = new Intent(activity, CameraActivity.class);
            activity.startActivity(intent);
        }
    }
}
