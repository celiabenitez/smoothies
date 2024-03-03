import React, { useState, useEffect } from 'react';
import OneSignal from 'react-onesignal';

let oneSignalInitialized = false;

export default async function runOneSignal() {
  console.log("init");
  if (oneSignalInitialized) {
    return
  }
  oneSignalInitialized = true;
  console.log("init2");
  await OneSignal.init({ 
    appId: 'b9c41c33-8196-4883-a129-21ce0ce5df41',  
    notifyButton: {
      enable: true,
    },
    allowLocalhostAsSecureOrigin: true});
  //OneSignal.Slidedown.promptPush();
}

