/*jslint sloppy: true, browser: true, devel: true */
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
chrome.extension.onRequest.addListener(function (request, sender) {
    if (request.action === "show_page_action") {
        chrome.pageAction.show(sender.tab.id);
        if (request.vccPresent) {
            console.log("VCC Present");
        } else {
            if (request.message === "NotFound") {
                console.log("Not found");
                chrome.pageAction.setPopup({tabId: sender.tab.id, popup: "popupNotFound.html"});
            } else if (request.message === "BadVersion") {
                console.log("Bad Version");
                chrome.pageAction.setPopup({tabId: sender.tab.id, popup: "popupBadVersion.html"});
            } else {
                console.log("???");
                chrome.pageAction.setPopup({tabId: sender.tab.id, popup: "popupBadVersion.html"});
            }
        }
    }
});