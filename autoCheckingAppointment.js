////////////////////////////////----DESCRIPTION----/////////////////////////////////////////////
// auto checking appointment availability at https://visa.vfsglobal.com/usa/en/fra/application-detail
// play sound to notify you when slot available.
//
// manually filled info by your self: Visa Application Centre; appointment category.
// this script will automatically select the 'sub-category' selector (the last one) to trigger the time slot query.
//
///////////////////////////////////---USAGE-----////////////////////////////////////////////////
// when your are on page: https://visa.vfsglobal.com/usa/en/fra/application-detail
// open devtools window of the page: F12 or right click and select 'inspect', switch to the 'Console' tab of the devtools
// paste the whole code and click 'enter' to run
// Note:
// you can call beep() in console to check whether you volume is good enough for notification
// you can always call 'sp()' anytime in console to stop checking.
//
////////////////////////////////////----CONFIG----///////////////////////////////////////////////
// please config: 'sub-category' index for your appointment!!!!!!!!
//
// i.e. for 'Long Stay (> 90 days)' category,
// sub-category index 0: 'Long Stay - Any other visa category'
// sub-category index 1: 'Long Stay Spouse of French Citizen, family member of EU national, spouse of Swiss national'
var subCategoryIndex = 0; // start from 0

// you can configure the query interval, but make sure you are not too frequent, otherwise you will be blocked.
// the CycliclyCheckingInterval = interval + random{0 to 1} * intervalVariation
var interval = 60 * 2; //seconds
var intervalVariation = 60; //seconds

/////////////////////////////////////-----LOGIC----//////////////////////////////////////////////
const myAudioContext = new AudioContext(); // reuse concurrent audio contexts
/**
 * Helper function to emit a beep sound in the browser using the Web Audio API.
 */
function beep(duration /*ms*/, frequency /*hz*/, volume /*0-100*/) {
  // resolves when the beep sound is finished.
  return new Promise((resolve, reject) => {
    // Set default duration
    duration = duration || 200;
    frequency = frequency || 440;
    volume = volume || 100;

    try {
      let oscillatorNode = myAudioContext.createOscillator();
      let gainNode = myAudioContext.createGain();
      oscillatorNode.connect(gainNode);

      oscillatorNode.frequency.value = frequency;
      oscillatorNode.type = "square";

      gainNode.connect(myAudioContext.destination);

      gainNode.gain.value = volume * 0.01;

      oscillatorNode.start(myAudioContext.currentTime);
      oscillatorNode.stop(myAudioContext.currentTime + duration * 0.001);

      oscillatorNode.onended = () => {
        resolve();
      };
    } catch (error) {
      reject(error);
    }
  });
}

var stopAll = false;
// call this to stop cyclicly checking
function sp() {
  clearTimeout(slotsCheckingTimer);
  stopAll = true;
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

var subCategorySelectorEm = document.querySelector(
  'mat-select[formcontrolname="visaCategoryCode"]'
);

var lastSubCategorySelectedIndex = -1;

var querySlot = async () => {
  subCategorySelectorEm.click();
  await delay(2000);

  var subCategorySelectorOptions = document.querySelectorAll("mat-option");

  var otherIndex = -1; // to switch back and forth with the subCategoryIndex
  for (var i = 0; i < subCategorySelectorOptions.length; i++) {
    if (otherIndex === -1 && i !== subCategoryIndex) {
      otherIndex = i;
      break;
    }
  }

  // check the selected index
  if (
    subCategorySelectorEm.innerText.includes(
      subCategorySelectorOptions[subCategoryIndex].innerText.trim()
    )
  ) {
    lastSubCategorySelectedIndex = subCategoryIndex;
  }

  if (lastSubCategorySelectedIndex !== subCategoryIndex) {
    subCategorySelectorOptions[subCategoryIndex].click();
  } else {
    subCategorySelectorOptions[otherIndex].click(); // clicking the other index to change
    await delay(3100);

    subCategorySelectorEm.click(); // show sub options again
    await delay(1000);
    subCategorySelectorOptions = document.querySelectorAll("mat-option");
    subCategorySelectorOptions[subCategoryIndex].click(); // click to check again
  }

  // for Angular application inputs to take effect
  subCategorySelectorEm.dispatchEvent(new Event("input"));
  subCategorySelectorEm.dispatchEvent(new Event("blur"));

  if (stopAll) console.warn("time slot checking stopped!");

  await delay(3100); // wait for response
  var available = document.body.innerText.includes("Earliest Available Slot");
  if (available) {
    console.log("Hurry up!! We find available appointment time!!");
    clearInterval(timer);
    // play sound
    var timer = setInterval(() => {
      beep();
      if (stopAll) {
        clearInterval(timer);
      }
    }, 2000);
  }

  if (!available && !stopAll) {
    var nextTime = interval + intervalVariation * Math.random();
    console.log(`checking slots (wait ${nextTime.toFixed(2)}s)...`);
    clearTimeout(slotsCheckingTimer);
    slotsCheckingTimer = setTimeout(querySlot, nextTime * 1000);
  }
};

function recoverConsole() {
  var i = document.createElement("iframe");
  i.style.display = "none";
  document.body.appendChild(i);
  window.console = i.contentWindow.console;
}
// reenable console output, this website removed the log related functions.
recoverConsole();

// initial query
querySlot();
var nextTime = interval + intervalVariation * Math.random();
console.log(`checking slots (wait ${nextTime.toFixed(2)}s)...`);
clearTimeout(slotsCheckingTimer);
var slotsCheckingTimer = setTimeout(querySlot, nextTime * 1000);

// this not work!
// goal: notify error
window.onerror = function (error) {
  // console.log(msg + ' - ' + url + ' - ' + lineNo + ' - ' + columnNo);
  clearInterval(timer);
  var timer = setInterval(() => {
    beep();
    if (stopAll) {
      clearInterval(timer);
    }
  }, 2000);
  return false;
};
