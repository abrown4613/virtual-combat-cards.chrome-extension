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
function buildBar() {
    var actionBar = document.createElement('div'),
        title_dom = document.createElement('strong'),
        actionImage = document.createElement('img'),
        actionLink = document.createElement('a'),
        style = document.createElement('link');
    actionBar.appendChild(title_dom);
    actionBar.setAttribute('class', 'vcc-bar');
    actionBar.setAttribute('id', 'vcc-bar');
    actionImage.setAttribute('src', chrome.extension.getURL('images/camera.png'));
    actionLink.setAttribute('href', '#');
    actionLink.appendChild(actionImage);
    actionLink.appendChild(document.createTextNode(" Capture"));
    actionLink.addEventListener("click", function () {
        dndiCapture.sendCapture(function (content) {
            var bar = document.getElementById('vcc-bar');
            bar.innerHTML = "Captured " + content;
            bar.setAttribute('class', 'vcc-bar vcc-complete');
        }, function (error) {
            var bar = document.getElementById('vcc-bar');
            bar.innerHTML = "Failed to capture: " + error;
            bar.setAttribute('class', 'vcc-bar vcc-error');
        });
    });
    actionLink.style.color = '#000';
    actionBar.appendChild(actionLink);

    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.extension.getURL('css/bar.css');

    document.head.appendChild(style);
    document.body.parentElement.insertBefore(actionBar, document.body);
}

dndiCapture.checkVCC(function () {
    if (dndiCapture.getEntryID(document.location)) {
        buildBar();
    }
    chrome.extension.sendRequest({action: "show_page_action", vccPresent: true});
}, function (message) {
    chrome.extension.sendRequest({action: "show_page_action", vccPresent: false, message: message});
});