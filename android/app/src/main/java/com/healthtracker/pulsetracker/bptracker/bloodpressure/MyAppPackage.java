package com.healthtracker.pulsetracker.bptracker.bloodpressure;
import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MyAppPackage implements ReactPackage {


    @Override
   public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
       return Collections.emptyList();
   }

   @Override
   public List<NativeModule> createNativeModules(
           ReactApplicationContext reactContext) {
       List<NativeModule> modules = new ArrayList<>();

       modules.add(new ActivityStarterModule(reactContext));

       return modules;
   }
//    @Override
//    protected List<ReactPackage> getPackages() {
//        List<ReactPackage> packages = new ArrayList<>();
//        packages.add(new MainReactPackage());
//        // Add other packages you use
//        packages.add(new ActivityStarterReactPackage());  // Your custom package
//        return packages;
//    }

}