////////////////////////////////----DESCRIPTION----/////////////////////////////////////////////
// autofill information for VISA applicants at https://visa.vfsglobal.com/usa/en/fra/your-details
// it supports filling multiple applications together
///////////////////////////////////---USAGE-----////////////////////////////////////////////////
// when your are on page: https://visa.vfsglobal.com/usa/en/fra/your-details
// open devtools window of the page: F12 or right click and select 'inspect', switch to the 'Console' tab of the devtools
// paste the whole code and click 'enter' to run
// ------------
// Note:
// after adding anther applicant, we need to manually run the below line in console to input the second application information
// inputInfo(info[1]);
//
// the third application information
// inputInfo(info[2]);
// -------------
/////////////////////////////////////-----LOGIC----//////////////////////////////////////////////
var info = [
  {
    referenceNumber: "FRA1HU20227088281",
    firstName: "firstName",
    lastName: "lastName",
    gender: 1, // 0: female; 1: male
    birthDate: "17/10/1837",
    nationality: "CHINA",
    passportNumber: "EB5035507",
    passportExpire: "22/10/2028",
    countryCode: "1", // for phone number
    phoneNumber: "8385028258",
    email: "meased3@gmail.com",
    address1: "103 ELRDGE PKWY",
    address2: "APT 144",
    state: "TEXAS",
    city: "HOUSTON",
    post: "67093",
  },
  {
    referenceNumber: "FRA1HU20227088291",
    firstName: "firstName",
    lastName: "lastName",
    gender: 1, // 0: female; 1: male
    birthDate: "17/10/1837",
    nationality: "CHINA",
    passportNumber: "EB5035507",
    passportExpire: "22/10/2028",
    countryCode: "1", // for phone number
    phoneNumber: "8385028258",
    email: "meased3@gmail.com",
    address1: "103 ELRDGE PKWY",
    address2: "APT 144",
    state: "TEXAS",
    city: "HOUSTON",
    post: "67093",
  },
];

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function select(lable, option) {
  var xpath = `//div[contains(text(), '${lable}')]`;
  // var xpath = "//div[text()='Gender']";
  var e = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  var s = e.parentElement.querySelector("mat-select");
  s.click();
  await delay(800);
  var options = document.querySelectorAll("mat-option");
  var index = option;
  if (isNaN(option)) {
    options.forEach((op, i) => {
      if (op.textContent.includes(option)) {
        index = i;
      }
    });
  }
  options[index].click();
}
function simulateKeyPress(textField, key) {
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
  // del: key: Delete, keycode: 46
  const event = new KeyboardEvent("keydown", { key });
  textField.dispatchEvent(event);
}
function inputDate(lable, date) {
  var xpath = `//div[contains(text(), '${lable}')]`;
  // var xpath = "//div[text()='Gender']";
  var e = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  var s = e.parentElement.querySelector("input");
  s.value = date;
  console.log("input date: " + lable + date);

  // for Angular application input to take effect
  s.dispatchEvent(new Event("input"));
  s.dispatchEvent(new Event("blur"));
  // 	simulateKeyPress(s, 'Delete');
  // 	simulateKeyPress(s, date[date.length -1]);
}

async function inputByPlaceholder(text, value) {
  console.log("input by placeholder: " + text + " : " + value);

  await delay(800);
  var ele = document.querySelector(`input[placeholder="${text}"]`);
  ele.value = value;
  // for Angular application input to take effect;
  ele.dispatchEvent(new Event("input"));
  ele.dispatchEvent(new Event("blur"));
}

async function inputInfo(info) {
  //   await inputByPlaceholder("Enter reference number", info.referenceNumber);
  await inputByPlaceholder("FRAXXXAAAAYNNNNNN", info.referenceNumber);
  await inputByPlaceholder("Enter your first name", info.firstName);
  await inputByPlaceholder("Please enter last name.", info.lastName);

  await select("Gender", info.gender);
  inputDate("Date Of Birth", info.birthDate);
  await select("Current Nationality", info.nationality);
  await inputByPlaceholder("Enter passport number", info.passportNumber);
  inputDate("Passport Expiry Date", info.passportExpire);
  await inputByPlaceholder("44", info.countryCode);
  await inputByPlaceholder("012345648382", info.phoneNumber);
  await inputByPlaceholder("Enter Email Address", info.email);
  await inputByPlaceholder("Enter Address line 1", info.address1);
  await inputByPlaceholder("Enter Address line 2", info.address2);
  await inputByPlaceholder("Enter state name", info.state);
  await inputByPlaceholder("Enter city name", info.city);
  await inputByPlaceholder("Enter your postcode", info.post);
}

// reenable console output, this website removed the log related functions.
function recoverConsole() {
  const frame = document.createElement("iframe");
  frame.style.display = "none";
  document.body.appendChild(frame);
  window.console = frame.contentWindow.console;
}
recoverConsole();

// start to fill the first application information
inputInfo(info[0]);
