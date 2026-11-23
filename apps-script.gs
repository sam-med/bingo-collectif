// Google Apps Script à coller dans un Google Sheet (Extensions > Apps Script).
// Voir README.md pour le déploiement.
var ADMIN_KEY = "CHANGEZ-MOI"; // clé pour lire les résultats depuis stats.html
var SHEET = "Reponses";

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(["timestamp", "participant", "square", "comment"]);
  return sh;
}

// Réception d'une grille : une ligne par case validée.
// Si la même personne renvoie, ses anciennes lignes sont remplacées (la dernière version compte).
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = JSON.parse(e.postData.contents);
    var who = String(data.participant || "").trim().slice(0, 60);
    if (!who) return out_({ error: "missing participant" });
    var sh = sheet_();
    var vals = sh.getDataRange().getValues();
    for (var i = vals.length - 1; i >= 1; i--) {
      if (String(vals[i][1]).toLowerCase() === who.toLowerCase()) sh.deleteRow(i + 1);
    }
    var now = new Date();
    var rows = (data.answers || []).filter(function (a) { return a.checked; }).map(function (a) {
      return [now, who, String(a.square).slice(0, 200), String(a.comment || "").slice(0, 200)];
    });
    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 4).setValues(rows);
    return out_({ ok: true, saved: rows.length });
  } finally {
    lock.releaseLock();
  }
}

// Lecture pour stats.html (protégée par la clé).
function doGet(e) {
  if (!e.parameter || e.parameter.key !== ADMIN_KEY) return out_({ error: "invalid key" });
  var vals = sheet_().getDataRange().getValues().slice(1);
  return out_({
    rows: vals.map(function (r) {
      return { timestamp: r[0] instanceof Date ? r[0].toISOString() : r[0], participant: r[1], square: r[2], comment: r[3] };
    })
  });
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
