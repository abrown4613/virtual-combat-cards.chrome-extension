/*
* Copyright (c) 2011 The Chromium Authors. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*/

function onText(data) {
    var trends_dom = document.createElement('div');
    var title_dom = document.createElement('strong');
    title_dom.innerText = 'D&D Insider Capture: ';
    trends_dom.appendChild(title_dom);
	var actionImage = document.createElement('img');
	actionImage.setAttribute('src', chrome.extension.getURL('images/camera.png'));
	var actionLink = document.createElement('a');
	actionLink.setAttribute('href', '#');
	actionLink.appendChild(actionImage);
	actionLink.appendChild(document.createTextNode(" Capture"));
	actionLink.addEventListener("click", function (event) {
		dndiCapture.sendCapture(function (xhr) { alert("Here " + xhr); });
	});
	actionLink.style.color = '#000';

	trends_dom.appendChild(actionLink);
    trends_dom.style.cssText = [
      'background-color: #ffd700;',
      'background-image: -webkit-repeating-linear-gradient(' +
          '45deg, transparent, transparent 35px,' +
          'rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px);',
      'color: #000;',
      'padding: 10px;',
      'font: 14px Arial;'
    ].join(' ');
    document.body.style.cssText = 'position: relative';
    document.body.parentElement.insertBefore(trends_dom, document.body);
};

dndiCapture.onVCCFound(onText);