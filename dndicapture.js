/*global window, Components, ActiveXObject, BrowserToolboxCustomizeDone, XPathResult, XMLSerializer*/
/*jslint white: true, onevar: true, undef: true, newcap: true, nomen: true, regexp: true, plusplus: true, bitwise: true, devel: true, browser: true, windows: true, maxerr: 50, indent: 4 */
/*
 * Copyright (C) 2008-2012 - Thomas Santana <tms@exnebula.org>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>
 */
var dndiCapture = {
	vccURL: "http://127.0.0.1:4143", 
    withGetReply: function (path, okCallback, errorCallback) {
        var url = this.vccURL,
            xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) {
                    if (okCallback) {
                        okCallback(xmlHttp.responseText);
                    }
                } else {
                    if (errorCallback) { 
                        errorCallback(xmlHttp.status, xmlHttp.responseText);
                    }
                }
            }
        };
        xmlHttp.open("GET", url + path, true);
        xmlHttp.send(null);
    },
	onVCCFound: function (callback) {
            // Go ahead
            this.withGetReply("/capture?has=reply-text", function (response) {
                if (response === "true") {
                    console.log("Found VCC");
					callback();
                } else {
                    console.log("Wrong Virtual Combat Cards Version", "The version of Virtual Combat Cards you are running does not support this automation. Please upgrade to version 1.4.0 or higher");
                }
            }, function (code, response) {
                console.log("Virtual Combat Cards Server not found");
            });
	},
    // Callback is only used if we have success, otherwise we stop everything
    sendCapture: function (callback) {
        var url = this.vccURL + "/capture?reply=plugin-text",
            data = this.findSection(),
            xmlHttp = new XMLHttpRequest(),
            serializer = new XMLSerializer();

        if (!data) {
            console.error("The page does not seem to contain and capturable data, must be a D&D Insider result page.");
            return 0;
        }
        data = serializer.serializeToString(data);

        xmlHttp.onreadystatechange = function () {
            var fields;
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) {
                    fields = xmlHttp.responseText.split(":");
                    if (fields.length === 2) {
                        console.log("Got: " + fields[1] + " - " + fields[0]);
                    } else {
                        console.log("Got: " + fields[0]);
                    }
                    if (callback) {
                        callback(xmlHttp);
                    }
                } else {
                    dndiCapture.addResult("Failed to contact VCC", "Failed");
                    dndiCapture.AutoCapture.stopAutomation();
                }
            }
        };
        // Open a connection to the server
        xmlHttp.open("POST", url, true);

        // Tell the server you're sending it XML
        xmlHttp.setRequestHeader("Content-Type", "text/xml");

        // Send the request
        xmlHttp.send(data);
    },
    getEntryID: function (url) {
        var re = new RegExp("id=([0-9]+)"),
            match = re.exec(url);
        if (match && match.length === 2) {
            return (match[1]);
        } else {
            return null;
        }
    },
    findSection: function () {
        var doc = document,
            id, 
            data, 
            xmldom, 
            res;

        if (doc !== null) {
            data = doc.getElementById("detail");
            id = this.getEntryID(doc.location);

            if (id !== null && data !== null) {
				var xmldom = document.implementation.createDocument(
					'http://www.w3.org/1999/xhtml',
					'div',
					null);

				xmldom.replaceChild(
					xmldom.importNode(data, true),
					xmldom.documentElement);
				xmldom.documentElement.setAttribute("id", id);
                return xmldom;
            }
		}
        return null;
    }	
};