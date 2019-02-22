function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}

function doGet(e){
  return handleResponse(e);
}

var SHEET_NAME = "***Your Google Sheet Name***";

var SCRIPT_PROP = PropertiesService.getScriptProperties(); //Create property service

function handleResponse(e) {

  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait for 30 seconds
  
  try {
    // Set where we to the data - You may write to multiple/different destinations
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    
    // Assumed header=1, can be ovveridden with Get(or Post whichever you use)
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = []; 
    // loop through the header columns
    for (i in headers){
      if (headers[i] == "Timestamp"){ // If you include a 'timestamp' column
        row.push(new Date());
      } else { // else use header name to get data
        row.push(e.parameter[headers[i]]);
      }
    }
    // Set values as [][] array than individually(Efficient way to do)
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // Return JSON success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    // if Error return
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //releasing lock
    lock.releaseLock();
  }
}
