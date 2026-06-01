'use strict';

const TILE_ART = {

2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FAD8F0"/><stop offset="100%" stop-color="#F0C0E5"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#g2)"/>
<circle cx="15" cy="10" r="1.5" fill="white" opacity="0.7"/>
<circle cx="80" cy="8" r="1.2" fill="white" opacity="0.5"/>
<circle cx="88" cy="22" r="1" fill="white" opacity="0.35"/>
<ellipse cx="50" cy="93" rx="21" ry="13" fill="#C07848"/>
<circle cx="30" cy="35" r="8.5" fill="#B87850"/>
<circle cx="30" cy="37" r="5.2" fill="#EBA882"/>
<circle cx="70" cy="35" r="8.5" fill="#B87850"/>
<circle cx="70" cy="37" r="5.2" fill="#EBA882"/>
<circle cx="50" cy="59" r="30" fill="#D4956A"/>
<ellipse cx="50" cy="69" rx="13" ry="9" fill="#EBA882"/>
<ellipse cx="50" cy="64" rx="4" ry="2.8" fill="#1A0A06"/>
<path d="M 37,57 Q 40,53 43,57" stroke="#1A0A06" stroke-width="2.3" fill="none" stroke-linecap="round"/>
<path d="M 57,57 Q 60,53 63,57" stroke="#1A0A06" stroke-width="2.3" fill="none" stroke-linecap="round"/>
<ellipse cx="36" cy="64.5" rx="7" ry="4.5" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="64" cy="64.5" rx="7" ry="4.5" fill="#FFB8C8" opacity="0.55"/>
</svg>`,

4: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFD8EC"/><stop offset="100%" stop-color="#FFC0DC"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#g4)"/>
<circle cx="85" cy="11" r="8.5" fill="#FFD740" opacity="0.9"/>
<circle cx="85" cy="11" r="13" fill="#FFE860" opacity="0.2"/>
<ellipse cx="50" cy="93" rx="21" ry="13" fill="#C07848"/>
<circle cx="30" cy="35" r="8.5" fill="#B87850"/>
<circle cx="30" cy="37" r="5.2" fill="#EBA882"/>
<circle cx="70" cy="35" r="8.5" fill="#B87850"/>
<circle cx="70" cy="37" r="5.2" fill="#EBA882"/>
<circle cx="50" cy="59" r="30" fill="#D4956A"/>
<ellipse cx="43" cy="31" rx="8.5" ry="5.5" fill="#FF85B3" transform="rotate(-15,43,31)"/>
<ellipse cx="57" cy="31" rx="8.5" ry="5.5" fill="#FF85B3" transform="rotate(15,57,31)"/>
<circle cx="50" cy="31" r="4.2" fill="#FF4488"/>
<ellipse cx="50" cy="69" rx="13" ry="9" fill="#EBA882"/>
<ellipse cx="50" cy="64" rx="4" ry="2.8" fill="#1A0A06"/>
<circle cx="40" cy="56.5" r="3.2" fill="#1A0A06"/>
<circle cx="38.6" cy="55.1" r="1.2" fill="white"/>
<circle cx="60" cy="56.5" r="3.2" fill="#1A0A06"/>
<circle cx="58.6" cy="55.1" r="1.2" fill="white"/>
<ellipse cx="36" cy="64.5" rx="7" ry="4.5" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="64" cy="64.5" rx="7" ry="4.5" fill="#FFB8C8" opacity="0.55"/>
</svg>`,

8: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g8" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#CCE8FF"/><stop offset="100%" stop-color="#A8D4FF"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#g8)"/>
<circle cx="58" cy="18" r="8" fill="white" opacity="0.92"/>
<circle cx="68" cy="13" r="10.5" fill="white" opacity="0.92"/>
<circle cx="79" cy="17" r="7.5" fill="white" opacity="0.92"/>
<ellipse cx="32" cy="91" rx="18" ry="13" fill="#C07848"/>
<circle cx="16" cy="38" r="7" fill="#B87850"/>
<circle cx="16" cy="39.5" r="4.3" fill="#EBA882"/>
<circle cx="48" cy="38" r="7" fill="#B87850"/>
<circle cx="48" cy="39.5" r="4.3" fill="#EBA882"/>
<circle cx="32" cy="57" r="24" fill="#D4956A"/>
<ellipse cx="32" cy="65" rx="10.5" ry="7.2" fill="#EBA882"/>
<ellipse cx="32" cy="61" rx="3.2" ry="2.2" fill="#1A0A06"/>
<circle cx="24" cy="55" r="2.6" fill="#1A0A06"/>
<circle cx="23" cy="53.7" r="1" fill="white"/>
<circle cx="40" cy="55" r="2.6" fill="#1A0A06"/>
<circle cx="39" cy="53.7" r="1" fill="white"/>
<ellipse cx="21" cy="61" rx="5.2" ry="3.5" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="43" cy="61" rx="5.2" ry="3.5" fill="#FFB8C8" opacity="0.55"/>
<path d="M 64,93 L 72,68 L 80,93 Z" fill="#E8C080"/>
<line x1="68.5" y1="77" x2="64.5" y2="92" stroke="#C8A060" stroke-width="1"/>
<line x1="72" y1="68" x2="72" y2="93" stroke="#C8A060" stroke-width="1"/>
<circle cx="72" cy="67" r="9.5" fill="white"/>
<circle cx="72" cy="57.5" r="8" fill="white"/>
<circle cx="72" cy="49.5" r="6" fill="white"/>
<circle cx="72" cy="43.5" r="4" fill="white"/>
</svg>`,

16: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g16" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#A8D8FF"/><stop offset="100%" stop-color="#80C0FF"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#g16)"/>
<circle cx="35" cy="14" r="7" fill="white" opacity="0.92"/>
<circle cx="44" cy="10" r="9.5" fill="white" opacity="0.92"/>
<circle cx="54" cy="13" r="6.5" fill="white" opacity="0.92"/>
<circle cx="78" cy="22" r="5.5" fill="white" opacity="0.88"/>
<circle cx="86" cy="18" r="7.5" fill="white" opacity="0.88"/>
<circle cx="94" cy="22" r="5" fill="white" opacity="0.88"/>
<ellipse cx="32" cy="91" rx="18" ry="13" fill="#C07848"/>
<circle cx="16" cy="38" r="7" fill="#B87850"/>
<circle cx="16" cy="39.5" r="4.3" fill="#EBA882"/>
<circle cx="48" cy="38" r="7" fill="#B87850"/>
<circle cx="48" cy="39.5" r="4.3" fill="#EBA882"/>
<circle cx="32" cy="57" r="24" fill="#D4956A"/>
<ellipse cx="32" cy="65" rx="10.5" ry="7.2" fill="#EBA882"/>
<ellipse cx="32" cy="61" rx="3.2" ry="2.2" fill="#1A0A06"/>
<circle cx="24" cy="55" r="2.6" fill="#1A0A06"/>
<circle cx="23" cy="53.7" r="1" fill="white"/>
<circle cx="40" cy="55" r="2.6" fill="#1A0A06"/>
<circle cx="39" cy="53.7" r="1" fill="white"/>
<ellipse cx="21" cy="61" rx="5.2" ry="3.5" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="43" cy="61" rx="5.2" ry="3.5" fill="#FFB8C8" opacity="0.55"/>
<path d="M 64,93 L 72,68 L 80,93 Z" fill="#E8C080"/>
<line x1="68.5" y1="77" x2="64.5" y2="92" stroke="#C8A060" stroke-width="1"/>
<circle cx="72" cy="67" r="10" fill="#FFB0C8"/>
<circle cx="72" cy="56" r="9.5" fill="#FFF8E8"/>
<circle cx="72" cy="46.5" r="4" fill="#CC2244"/>
<circle cx="73.2" cy="44.8" r="1.3" fill="white" opacity="0.6"/>
<path d="M 72,43 Q 74,40 75,37" stroke="#3A8A22" stroke-width="1.3" fill="none" stroke-linecap="round"/>
</svg>`,

32: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g32" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFE888"/><stop offset="100%" stop-color="#FFD050"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#g32)"/>
<circle cx="18" cy="17" r="12" fill="#FFD740" opacity="0.92"/>
<circle cx="18" cy="17" r="17" fill="#FFE860" opacity="0.22"/>
<line x1="18" y1="1" x2="18" y2="4.5" stroke="#FFB800" stroke-width="1.8" stroke-linecap="round"/>
<line x1="18" y1="29.5" x2="18" y2="33" stroke="#FFB800" stroke-width="1.8" stroke-linecap="round"/>
<line x1="2" y1="17" x2="5.5" y2="17" stroke="#FFB800" stroke-width="1.8" stroke-linecap="round"/>
<line x1="30.5" y1="17" x2="34" y2="17" stroke="#FFB800" stroke-width="1.8" stroke-linecap="round"/>
<line x1="7.5" y1="6.5" x2="10" y2="9" stroke="#FFB800" stroke-width="1.5" stroke-linecap="round"/>
<line x1="26" y1="25" x2="28.5" y2="27.5" stroke="#FFB800" stroke-width="1.5" stroke-linecap="round"/>
<line x1="28.5" y1="6.5" x2="26" y2="9" stroke="#FFB800" stroke-width="1.5" stroke-linecap="round"/>
<line x1="7.5" y1="27.5" x2="10" y2="25" stroke="#FFB800" stroke-width="1.5" stroke-linecap="round"/>
<rect x="68" y="7" width="7" height="4.5" rx="1.5" fill="#FF5599" transform="rotate(25,71.5,9.25)"/>
<rect x="82" y="16" width="6" height="3.5" rx="1" fill="#8888FF" transform="rotate(-20,85,17.75)"/>
<rect x="60" y="20" width="5.5" height="3.5" rx="1" fill="#44CCAA" transform="rotate(40,62.75,21.75)"/>
<rect x="78" y="30" width="6.5" height="4" rx="1.5" fill="#FF8830" transform="rotate(-35,81.25,32)"/>
<circle cx="90" cy="11" r="3" fill="#FF8888"/>
<circle cx="65" cy="35" r="2.5" fill="#AAEE44"/>
<path d="M 50,16 L 37,44 L 63,44 Z" fill="#FF5599"/>
<line x1="42" y1="35" x2="58" y2="32" stroke="#FFD0E8" stroke-width="1.6" opacity="0.85"/>
<line x1="40.5" y1="41" x2="59.5" y2="38" stroke="#FFD0E8" stroke-width="1.6" opacity="0.85"/>
<circle cx="50" cy="15" r="3.2" fill="#FFD740"/>
<ellipse cx="50" cy="91" rx="22" ry="13" fill="#C07848"/>
<circle cx="32" cy="47" r="7.8" fill="#B87850"/>
<circle cx="32" cy="48.5" r="4.8" fill="#EBA882"/>
<circle cx="68" cy="47" r="7.8" fill="#B87850"/>
<circle cx="68" cy="48.5" r="4.8" fill="#EBA882"/>
<circle cx="50" cy="68" r="26" fill="#D4956A"/>
<ellipse cx="50" cy="44" rx="13.5" ry="3.5" fill="#C82878"/>
<ellipse cx="50" cy="78" rx="11.5" ry="8" fill="#EBA882"/>
<ellipse cx="50" cy="73" rx="3.5" ry="2.5" fill="#1A0A06"/>
<circle cx="42" cy="66" r="2.8" fill="#1A0A06"/>
<circle cx="40.8" cy="64.8" r="1.1" fill="white"/>
<circle cx="58" cy="66" r="2.8" fill="#1A0A06"/>
<circle cx="56.8" cy="64.8" r="1.1" fill="white"/>
<ellipse cx="38" cy="73" rx="6.5" ry="4.2" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="62" cy="73" rx="6.5" ry="4.2" fill="#FFB8C8" opacity="0.55"/>
</svg>`,

64: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g64" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFD070"/><stop offset="100%" stop-color="#FFB030"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#g64)"/>
<ellipse cx="50" cy="102" rx="40" ry="26" fill="#FFCC30" opacity="0.7"/>
<g opacity="0.88">
<circle cx="6" cy="84" r="4.5" fill="#FF88CC"/><circle cx="6" cy="79.5" r="2.8" fill="#FFD740"/>
<circle cx="14" cy="91" r="3.8" fill="#FF88CC"/><circle cx="14" cy="87.2" r="2.2" fill="#FFD740"/>
<circle cx="86" cy="84" r="4.5" fill="#FF88CC"/><circle cx="86" cy="79.5" r="2.8" fill="#FFD740"/>
<circle cx="94" cy="91" r="3.8" fill="#FF88CC"/><circle cx="94" cy="87.2" r="2.2" fill="#FFD740"/>
</g>
<ellipse cx="28" cy="91" rx="16" ry="11" fill="#C07848"/>
<circle cx="14" cy="52" r="6.2" fill="#B87850"/>
<circle cx="14" cy="53.5" r="3.8" fill="#EBA882"/>
<circle cx="42" cy="52" r="6.2" fill="#B87850"/>
<circle cx="42" cy="53.5" r="3.8" fill="#EBA882"/>
<circle cx="28" cy="68" r="20" fill="#D4956A"/>
<ellipse cx="28" cy="74.5" rx="8.5" ry="6" fill="#EBA882"/>
<ellipse cx="28" cy="70.8" rx="2.6" ry="1.9" fill="#1A0A06"/>
<circle cx="22" cy="66.2" r="2.3" fill="#1A0A06"/>
<circle cx="21.2" cy="65.1" r="0.9" fill="white"/>
<circle cx="34" cy="66.2" r="2.3" fill="#1A0A06"/>
<circle cx="33.2" cy="65.1" r="0.9" fill="white"/>
<ellipse cx="20" cy="71.5" rx="4.8" ry="3.2" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="36" cy="71.5" rx="4.8" ry="3.2" fill="#FFB8C8" opacity="0.55"/>
<path d="M 50,58 C 50,54.5 46.5,51 43.5,53.5 C 40.5,56 43.5,61.5 50,67 C 56.5,61.5 59.5,56 56.5,53.5 C 53.5,51 50,54.5 50,58 Z" fill="#FF4488" opacity="0.9"/>
<ellipse cx="72" cy="91" rx="16" ry="11" fill="#C07848"/>
<circle cx="58" cy="52" r="6.2" fill="#B87850"/>
<circle cx="58" cy="53.5" r="3.8" fill="#EBA882"/>
<circle cx="86" cy="52" r="6.2" fill="#B87850"/>
<circle cx="86" cy="53.5" r="3.8" fill="#EBA882"/>
<circle cx="72" cy="68" r="20" fill="#D4956A"/>
<ellipse cx="72" cy="74.5" rx="8.5" ry="6" fill="#EBA882"/>
<ellipse cx="72" cy="70.8" rx="2.6" ry="1.9" fill="#1A0A06"/>
<circle cx="66" cy="66.2" r="2.3" fill="#1A0A06"/>
<circle cx="65.2" cy="65.1" r="0.9" fill="white"/>
<circle cx="78" cy="66.2" r="2.3" fill="#1A0A06"/>
<circle cx="77.2" cy="65.1" r="0.9" fill="white"/>
<ellipse cx="64" cy="71.5" rx="4.8" ry="3.2" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="80" cy="71.5" rx="4.8" ry="3.2" fill="#FFB8C8" opacity="0.55"/>
</svg>`,

128: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g128" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFB860"/><stop offset="100%" stop-color="#FF9030"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#g128)"/>
<circle cx="50" cy="106" r="36" fill="#FFAA20" opacity="0.45"/>
<circle cx="50" cy="106" r="22" fill="#FFD040" opacity="0.35"/>
<ellipse cx="28" cy="91" rx="16" ry="11" fill="#C07848"/>
<circle cx="14" cy="52" r="6.2" fill="#B87850"/>
<circle cx="14" cy="53.5" r="3.8" fill="#EBA882"/>
<circle cx="42" cy="52" r="6.2" fill="#B87850"/>
<circle cx="42" cy="53.5" r="3.8" fill="#EBA882"/>
<circle cx="28" cy="68" r="20" fill="#D4956A"/>
<ellipse cx="28" cy="74.5" rx="8.5" ry="6" fill="#EBA882"/>
<ellipse cx="28" cy="70.8" rx="2.6" ry="1.9" fill="#1A0A06"/>
<circle cx="22" cy="66.2" r="2.3" fill="#1A0A06"/>
<circle cx="21.2" cy="65.1" r="0.9" fill="white"/>
<circle cx="34" cy="66.2" r="2.3" fill="#1A0A06"/>
<circle cx="33.2" cy="65.1" r="0.9" fill="white"/>
<ellipse cx="20" cy="71.5" rx="4.8" ry="3.2" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="36" cy="71.5" rx="4.8" ry="3.2" fill="#FFB8C8" opacity="0.55"/>
<path d="M 24,96 L 28,83 L 32,96 Z" fill="#E8C080"/>
<circle cx="28" cy="82" r="6.5" fill="#FFB0C8"/>
<circle cx="28" cy="75" r="5.5" fill="#FFF8E0"/>
<circle cx="28" cy="69.5" r="2.8" fill="#CC2244"/>
<ellipse cx="72" cy="91" rx="16" ry="11" fill="#C07848"/>
<circle cx="58" cy="52" r="6.2" fill="#B87850"/>
<circle cx="58" cy="53.5" r="3.8" fill="#EBA882"/>
<circle cx="86" cy="52" r="6.2" fill="#B87850"/>
<circle cx="86" cy="53.5" r="3.8" fill="#EBA882"/>
<circle cx="72" cy="68" r="20" fill="#D4956A"/>
<ellipse cx="72" cy="74.5" rx="8.5" ry="6" fill="#EBA882"/>
<ellipse cx="72" cy="70.8" rx="2.6" ry="1.9" fill="#1A0A06"/>
<circle cx="66" cy="66.2" r="2.3" fill="#1A0A06"/>
<circle cx="65.2" cy="65.1" r="0.9" fill="white"/>
<circle cx="78" cy="66.2" r="2.3" fill="#1A0A06"/>
<circle cx="77.2" cy="65.1" r="0.9" fill="white"/>
<ellipse cx="64" cy="71.5" rx="4.8" ry="3.2" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="80" cy="71.5" rx="4.8" ry="3.2" fill="#FFB8C8" opacity="0.55"/>
<path d="M 68,96 L 72,83 L 76,96 Z" fill="#E8C080"/>
<circle cx="72" cy="82" r="6.5" fill="#FFB0C8"/>
<circle cx="72" cy="75" r="5.5" fill="#FFF8E0"/>
<circle cx="72" cy="69.5" r="2.8" fill="#CC2244"/>
</svg>`,

256: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g256" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FF8050"/><stop offset="100%" stop-color="#FF5030"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#g256)"/>
<ellipse cx="50" cy="100" rx="58" ry="28" fill="#FF5F18" opacity="0.5"/>
<circle cx="12" cy="8" r="1.4" fill="white" opacity="0.8"/>
<circle cx="55" cy="5" r="1.1" fill="white" opacity="0.7"/>
<circle cx="91" cy="11" r="1.3" fill="white" opacity="0.75"/>
<circle cx="7" cy="54" r="5" fill="#B87850"/>
<circle cx="7" cy="55.2" r="3.1" fill="#EBA882"/>
<circle cx="29" cy="54" r="5" fill="#B87850"/>
<circle cx="29" cy="55.2" r="3.1" fill="#EBA882"/>
<circle cx="18" cy="68" r="17" fill="#D4956A"/>
<ellipse cx="18" cy="73.5" rx="7.2" ry="5.2" fill="#EBA882"/>
<ellipse cx="18" cy="69.8" rx="2.2" ry="1.6" fill="#1A0A06"/>
<circle cx="12.5" cy="66.3" r="1.8" fill="#1A0A06"/>
<circle cx="11.8" cy="65.5" r="0.7" fill="white"/>
<circle cx="23.5" cy="66.3" r="1.8" fill="#1A0A06"/>
<circle cx="22.8" cy="65.5" r="0.7" fill="white"/>
<ellipse cx="11" cy="70.2" rx="3.9" ry="2.7" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="25" cy="70.2" rx="3.9" ry="2.7" fill="#FFB8C8" opacity="0.55"/>
<circle cx="37" cy="51" r="5.6" fill="#B87850"/>
<circle cx="37" cy="52.5" r="3.5" fill="#EBA882"/>
<circle cx="63" cy="51" r="5.6" fill="#B87850"/>
<circle cx="63" cy="52.5" r="3.5" fill="#EBA882"/>
<circle cx="50" cy="66" r="19" fill="#D4956A"/>
<ellipse cx="50" cy="72.2" rx="8" ry="5.8" fill="#EBA882"/>
<ellipse cx="50" cy="68.4" rx="2.5" ry="1.8" fill="#1A0A06"/>
<circle cx="43.5" cy="64.2" r="2.1" fill="#1A0A06"/>
<circle cx="42.7" cy="63.3" r="0.85" fill="white"/>
<circle cx="56.5" cy="64.2" r="2.1" fill="#1A0A06"/>
<circle cx="55.7" cy="63.3" r="0.85" fill="white"/>
<ellipse cx="42" cy="68.8" rx="4.3" ry="3" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="58" cy="68.8" rx="4.3" ry="3" fill="#FFB8C8" opacity="0.55"/>
<circle cx="73" cy="59" r="4.1" fill="#B87850"/>
<circle cx="73" cy="60.1" r="2.5" fill="#EBA882"/>
<circle cx="91" cy="59" r="4.1" fill="#B87850"/>
<circle cx="91" cy="60.1" r="2.5" fill="#EBA882"/>
<circle cx="82" cy="70" r="14" fill="#D4956A"/>
<ellipse cx="82" cy="75.2" rx="5.9" ry="4.2" fill="#EBA882"/>
<ellipse cx="82" cy="72" rx="1.8" ry="1.3" fill="#1A0A06"/>
<circle cx="77" cy="68.6" r="1.5" fill="#1A0A06"/>
<circle cx="76.4" cy="67.9" r="0.6" fill="white"/>
<circle cx="87" cy="68.6" r="1.5" fill="#1A0A06"/>
<circle cx="86.4" cy="67.9" r="0.6" fill="white"/>
<ellipse cx="76" cy="71.8" rx="3.2" ry="2.3" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="88" cy="71.8" rx="3.2" ry="2.3" fill="#FFB8C8" opacity="0.55"/>
</svg>`,

512: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g512" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#C050A0"/><stop offset="100%" stop-color="#882888"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#g512)"/>
<circle cx="10" cy="8" r="1.4" fill="white" opacity="0.9"/>
<circle cx="30" cy="5" r="1.1" fill="white" opacity="0.82"/>
<circle cx="60" cy="7" r="1.3" fill="white" opacity="0.87"/>
<circle cx="80" cy="4" r="1" fill="white" opacity="0.78"/>
<circle cx="95" cy="14" r="1.2" fill="white" opacity="0.84"/>
<circle cx="7" cy="48" r="5" fill="#B87850"/>
<circle cx="7" cy="49.2" r="3.1" fill="#EBA882"/>
<circle cx="29" cy="48" r="5" fill="#B87850"/>
<circle cx="29" cy="49.2" r="3.1" fill="#EBA882"/>
<circle cx="18" cy="62" r="17" fill="#D4956A"/>
<ellipse cx="18" cy="67.5" rx="7.2" ry="5.2" fill="#EBA882"/>
<ellipse cx="18" cy="63.8" rx="2.2" ry="1.6" fill="#1A0A06"/>
<circle cx="12.5" cy="60.3" r="1.8" fill="#1A0A06"/>
<circle cx="11.8" cy="59.5" r="0.7" fill="white"/>
<circle cx="23.5" cy="60.3" r="1.8" fill="#1A0A06"/>
<circle cx="22.8" cy="59.5" r="0.7" fill="white"/>
<ellipse cx="11" cy="64.2" rx="3.9" ry="2.7" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="25" cy="64.2" rx="3.9" ry="2.7" fill="#FFB8C8" opacity="0.55"/>
<circle cx="37" cy="45" r="5.6" fill="#B87850"/>
<circle cx="37" cy="46.5" r="3.5" fill="#EBA882"/>
<circle cx="63" cy="45" r="5.6" fill="#B87850"/>
<circle cx="63" cy="46.5" r="3.5" fill="#EBA882"/>
<circle cx="50" cy="60" r="19" fill="#D4956A"/>
<ellipse cx="50" cy="66.2" rx="8" ry="5.8" fill="#EBA882"/>
<ellipse cx="50" cy="62.4" rx="2.5" ry="1.8" fill="#1A0A06"/>
<circle cx="43.5" cy="58.2" r="2.1" fill="#1A0A06"/>
<circle cx="42.7" cy="57.3" r="0.85" fill="white"/>
<circle cx="56.5" cy="58.2" r="2.1" fill="#1A0A06"/>
<circle cx="55.7" cy="57.3" r="0.85" fill="white"/>
<ellipse cx="42" cy="62.8" rx="4.3" ry="3" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="58" cy="62.8" rx="4.3" ry="3" fill="#FFB8C8" opacity="0.55"/>
<circle cx="73" cy="53" r="4.1" fill="#B87850"/>
<circle cx="73" cy="54.1" r="2.5" fill="#EBA882"/>
<circle cx="91" cy="53" r="4.1" fill="#B87850"/>
<circle cx="91" cy="54.1" r="2.5" fill="#EBA882"/>
<circle cx="82" cy="64" r="14" fill="#D4956A"/>
<ellipse cx="82" cy="69.2" rx="5.9" ry="4.2" fill="#EBA882"/>
<ellipse cx="82" cy="66" rx="1.8" ry="1.3" fill="#1A0A06"/>
<circle cx="77" cy="62.6" r="1.5" fill="#1A0A06"/>
<circle cx="76.4" cy="61.9" r="0.6" fill="white"/>
<circle cx="87" cy="62.6" r="1.5" fill="#1A0A06"/>
<circle cx="86.4" cy="61.9" r="0.6" fill="white"/>
<ellipse cx="76" cy="65.8" rx="3.2" ry="2.3" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="88" cy="65.8" rx="3.2" ry="2.3" fill="#FFB8C8" opacity="0.55"/>
<rect x="32" y="82" width="36" height="13" rx="3" fill="#FFD0E8"/>
<rect x="36" y="74" width="28" height="10" rx="2.5" fill="#FFB8D0"/>
<rect x="41" y="69" width="3.5" height="7" rx="1" fill="#FFF0C8"/>
<ellipse cx="42.75" cy="68.2" rx="2.8" ry="2" fill="#FFD000" opacity="0.92"/>
<rect x="48.25" y="69" width="3.5" height="7" rx="1" fill="#C8F0FF"/>
<ellipse cx="50" cy="68.2" rx="2.8" ry="2" fill="#FFD000" opacity="0.92"/>
<rect x="55.5" y="69" width="3.5" height="7" rx="1" fill="#FFD0E8"/>
<ellipse cx="57.25" cy="68.2" rx="2.8" ry="2" fill="#FFD000" opacity="0.92"/>
<circle cx="40.5" cy="89" r="1.6" fill="#FF88BB"/>
<circle cx="50" cy="89" r="1.6" fill="#FF88BB"/>
<circle cx="59.5" cy="89" r="1.6" fill="#FF88BB"/>
</svg>`,

1024: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g1024" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#383880"/><stop offset="100%" stop-color="#1C1C58"/></linearGradient></defs>
<rect width="100" height="100" fill="url(#g1024)"/>
<circle cx="8" cy="6" r="1.5" fill="white" opacity="0.92"/>
<circle cx="22" cy="12" r="1.1" fill="white" opacity="0.82"/>
<circle cx="40" cy="4" r="1.4" fill="white" opacity="0.88"/>
<circle cx="58" cy="10" r="1.2" fill="white" opacity="0.82"/>
<circle cx="72" cy="5" r="1.3" fill="white" opacity="0.9"/>
<circle cx="86" cy="12" r="1.1" fill="white" opacity="0.78"/>
<circle cx="96" cy="4" r="1.4" fill="white" opacity="0.88"/>
<circle cx="15" cy="22" r="1" fill="white" opacity="0.72"/>
<circle cx="7" cy="48" r="5" fill="#B87850"/>
<circle cx="7" cy="49.2" r="3.1" fill="#EBA882"/>
<circle cx="29" cy="48" r="5" fill="#B87850"/>
<circle cx="29" cy="49.2" r="3.1" fill="#EBA882"/>
<circle cx="18" cy="62" r="17" fill="#D4956A"/>
<path d="M 10,45 L 10,37 L 14.7,41 L 18,37 L 21.3,41 L 26,37 L 26,45 Z" fill="#FFD700" stroke="#B8860B" stroke-width="0.8"/>
<ellipse cx="18" cy="45" rx="8" ry="2" fill="#FFD700"/>
<circle cx="14" cy="36.8" r="1.6" fill="#FF5599"/>
<circle cx="18" cy="36.2" r="1.6" fill="#88DDFF"/>
<circle cx="22" cy="36.8" r="1.6" fill="#FF5599"/>
<ellipse cx="18" cy="67.5" rx="7.2" ry="5.2" fill="#EBA882"/>
<ellipse cx="18" cy="63.8" rx="2.2" ry="1.6" fill="#1A0A06"/>
<circle cx="12.5" cy="60.3" r="1.8" fill="#1A0A06"/>
<circle cx="11.8" cy="59.5" r="0.7" fill="white"/>
<circle cx="23.5" cy="60.3" r="1.8" fill="#1A0A06"/>
<circle cx="22.8" cy="59.5" r="0.7" fill="white"/>
<ellipse cx="11" cy="64.2" rx="3.9" ry="2.7" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="25" cy="64.2" rx="3.9" ry="2.7" fill="#FFB8C8" opacity="0.55"/>
<circle cx="37" cy="45" r="5.6" fill="#B87850"/>
<circle cx="37" cy="46.5" r="3.5" fill="#EBA882"/>
<circle cx="63" cy="45" r="5.6" fill="#B87850"/>
<circle cx="63" cy="46.5" r="3.5" fill="#EBA882"/>
<circle cx="50" cy="60" r="19" fill="#D4956A"/>
<path d="M 41,41 L 41,32 L 46.7,36.5 L 50,32 L 53.3,36.5 L 59,32 L 59,41 Z" fill="#FFD700" stroke="#B8860B" stroke-width="0.8"/>
<ellipse cx="50" cy="41" rx="9" ry="2.1" fill="#FFD700"/>
<circle cx="45" cy="31.8" r="1.7" fill="#FF5599"/>
<circle cx="50" cy="31.2" r="1.7" fill="#88DDFF"/>
<circle cx="55" cy="31.8" r="1.7" fill="#FF5599"/>
<ellipse cx="50" cy="66.2" rx="8" ry="5.8" fill="#EBA882"/>
<ellipse cx="50" cy="62.4" rx="2.5" ry="1.8" fill="#1A0A06"/>
<circle cx="43.5" cy="58.2" r="2.1" fill="#1A0A06"/>
<circle cx="42.7" cy="57.3" r="0.85" fill="white"/>
<circle cx="56.5" cy="58.2" r="2.1" fill="#1A0A06"/>
<circle cx="55.7" cy="57.3" r="0.85" fill="white"/>
<ellipse cx="42" cy="62.8" rx="4.3" ry="3" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="58" cy="62.8" rx="4.3" ry="3" fill="#FFB8C8" opacity="0.55"/>
<circle cx="73" cy="53" r="4.1" fill="#B87850"/>
<circle cx="73" cy="54.1" r="2.5" fill="#EBA882"/>
<circle cx="91" cy="53" r="4.1" fill="#B87850"/>
<circle cx="91" cy="54.1" r="2.5" fill="#EBA882"/>
<circle cx="82" cy="64" r="14" fill="#D4956A"/>
<path d="M 75,51 L 75,44 L 79.3,47.5 L 82,44 L 84.7,47.5 L 89,44 L 89,51 Z" fill="#FFD700" stroke="#B8860B" stroke-width="0.8"/>
<ellipse cx="82" cy="51" rx="7" ry="1.7" fill="#FFD700"/>
<circle cx="78.5" cy="43.8" r="1.4" fill="#FF5599"/>
<circle cx="82" cy="43.2" r="1.4" fill="#88DDFF"/>
<circle cx="85.5" cy="43.8" r="1.4" fill="#FF5599"/>
<ellipse cx="82" cy="69.2" rx="5.9" ry="4.2" fill="#EBA882"/>
<ellipse cx="82" cy="66" rx="1.8" ry="1.3" fill="#1A0A06"/>
<circle cx="77" cy="62.6" r="1.5" fill="#1A0A06"/>
<circle cx="76.4" cy="61.9" r="0.6" fill="white"/>
<circle cx="87" cy="62.6" r="1.5" fill="#1A0A06"/>
<circle cx="86.4" cy="61.9" r="0.6" fill="white"/>
<ellipse cx="76" cy="65.8" rx="3.2" ry="2.3" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="88" cy="65.8" rx="3.2" ry="2.3" fill="#FFB8C8" opacity="0.55"/>
</svg>`,

2048: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs>
<linearGradient id="g2048" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#180C30"/><stop offset="100%" stop-color="#0C0820"/></linearGradient>
<mask id="moonmask2048"><circle cx="20" cy="18" r="13" fill="white"/><circle cx="27.5" cy="14" r="11" fill="black"/></mask>
</defs>
<rect width="100" height="100" fill="url(#g2048)"/>
<circle cx="8" cy="5" r="1.5" fill="white" opacity="0.95"/>
<circle cx="18" cy="11" r="1" fill="white" opacity="0.85"/>
<circle cx="35" cy="4" r="1.4" fill="white" opacity="0.92"/>
<circle cx="48" cy="9" r="1.1" fill="white" opacity="0.82"/>
<circle cx="62" cy="3" r="1.5" fill="white" opacity="0.95"/>
<circle cx="75" cy="7" r="1.2" fill="white" opacity="0.87"/>
<circle cx="90" cy="3" r="1.4" fill="white" opacity="0.92"/>
<circle cx="97" cy="13" r="1" fill="white" opacity="0.8"/>
<circle cx="55" cy="16" r="0.9" fill="white" opacity="0.72"/>
<circle cx="30" cy="19" r="1.1" fill="white" opacity="0.78"/>
<circle cx="85" cy="19" r="1" fill="white" opacity="0.72"/>
<circle cx="12" cy="26" r="0.8" fill="white" opacity="0.65"/>
<circle cx="44" cy="23" r="0.8" fill="white" opacity="0.62"/>
<circle cx="94" cy="28" r="0.9" fill="white" opacity="0.68"/>
<circle cx="70" cy="25" r="0.8" fill="white" opacity="0.62"/>
<circle cx="22" cy="32" r="0.7" fill="white" opacity="0.55"/>
<circle cx="20" cy="18" r="13" fill="#FFE870" mask="url(#moonmask2048)"/>
<g stroke="#FFE090" stroke-linecap="round" opacity="0.88">
<line x1="83" y1="12" x2="83" y2="6.5" stroke-width="1.6"/>
<line x1="83" y1="12" x2="83" y2="17.5" stroke-width="1.6"/>
<line x1="83" y1="12" x2="77.5" y2="12" stroke-width="1.6"/>
<line x1="83" y1="12" x2="88.5" y2="12" stroke-width="1.6"/>
<line x1="83" y1="12" x2="79.1" y2="8.1" stroke-width="1.1"/>
<line x1="83" y1="12" x2="86.9" y2="15.9" stroke-width="1.1"/>
<line x1="83" y1="12" x2="86.9" y2="8.1" stroke-width="1.1"/>
<line x1="83" y1="12" x2="79.1" y2="15.9" stroke-width="1.1"/>
</g>
<circle cx="7" cy="48" r="5" fill="#B87850"/>
<circle cx="7" cy="49.2" r="3.1" fill="#EBA882"/>
<circle cx="29" cy="48" r="5" fill="#B87850"/>
<circle cx="29" cy="49.2" r="3.1" fill="#EBA882"/>
<circle cx="18" cy="62" r="17" fill="#D4956A"/>
<path d="M 10,45 L 10,37 L 14.7,41 L 18,37 L 21.3,41 L 26,37 L 26,45 Z" fill="#FFD700" stroke="#B8860B" stroke-width="0.8"/>
<ellipse cx="18" cy="45" rx="8" ry="2" fill="#FFD700"/>
<circle cx="14" cy="36.8" r="1.6" fill="#FF5599"/>
<circle cx="18" cy="36.2" r="1.6" fill="#88DDFF"/>
<circle cx="22" cy="36.8" r="1.6" fill="#FF5599"/>
<ellipse cx="18" cy="67.5" rx="7.2" ry="5.2" fill="#EBA882"/>
<ellipse cx="18" cy="63.8" rx="2.2" ry="1.6" fill="#1A0A06"/>
<circle cx="12.5" cy="60.3" r="1.8" fill="#1A0A06"/>
<circle cx="11.8" cy="59.5" r="0.7" fill="white"/>
<circle cx="23.5" cy="60.3" r="1.8" fill="#1A0A06"/>
<circle cx="22.8" cy="59.5" r="0.7" fill="white"/>
<ellipse cx="11" cy="64.2" rx="3.9" ry="2.7" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="25" cy="64.2" rx="3.9" ry="2.7" fill="#FFB8C8" opacity="0.55"/>
<circle cx="37" cy="45" r="5.6" fill="#B87850"/>
<circle cx="37" cy="46.5" r="3.5" fill="#EBA882"/>
<circle cx="63" cy="45" r="5.6" fill="#B87850"/>
<circle cx="63" cy="46.5" r="3.5" fill="#EBA882"/>
<circle cx="50" cy="60" r="19" fill="#D4956A"/>
<path d="M 41,41 L 41,32 L 46.7,36.5 L 50,32 L 53.3,36.5 L 59,32 L 59,41 Z" fill="#FFD700" stroke="#B8860B" stroke-width="0.8"/>
<ellipse cx="50" cy="41" rx="9" ry="2.1" fill="#FFD700"/>
<circle cx="45" cy="31.8" r="1.7" fill="#FF5599"/>
<circle cx="50" cy="31.2" r="1.7" fill="#88DDFF"/>
<circle cx="55" cy="31.8" r="1.7" fill="#FF5599"/>
<ellipse cx="50" cy="66.2" rx="8" ry="5.8" fill="#EBA882"/>
<ellipse cx="50" cy="62.4" rx="2.5" ry="1.8" fill="#1A0A06"/>
<circle cx="43.5" cy="58.2" r="2.1" fill="#1A0A06"/>
<circle cx="42.7" cy="57.3" r="0.85" fill="white"/>
<circle cx="56.5" cy="58.2" r="2.1" fill="#1A0A06"/>
<circle cx="55.7" cy="57.3" r="0.85" fill="white"/>
<ellipse cx="42" cy="62.8" rx="4.3" ry="3" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="58" cy="62.8" rx="4.3" ry="3" fill="#FFB8C8" opacity="0.55"/>
<circle cx="73" cy="53" r="4.1" fill="#B87850"/>
<circle cx="73" cy="54.1" r="2.5" fill="#EBA882"/>
<circle cx="91" cy="53" r="4.1" fill="#B87850"/>
<circle cx="91" cy="54.1" r="2.5" fill="#EBA882"/>
<circle cx="82" cy="64" r="14" fill="#D4956A"/>
<path d="M 75,51 L 75,44 L 79.3,47.5 L 82,44 L 84.7,47.5 L 89,44 L 89,51 Z" fill="#FFD700" stroke="#B8860B" stroke-width="0.8"/>
<ellipse cx="82" cy="51" rx="7" ry="1.7" fill="#FFD700"/>
<circle cx="78.5" cy="43.8" r="1.4" fill="#FF5599"/>
<circle cx="82" cy="43.2" r="1.4" fill="#88DDFF"/>
<circle cx="85.5" cy="43.8" r="1.4" fill="#FF5599"/>
<ellipse cx="82" cy="69.2" rx="5.9" ry="4.2" fill="#EBA882"/>
<ellipse cx="82" cy="66" rx="1.8" ry="1.3" fill="#1A0A06"/>
<circle cx="77" cy="62.6" r="1.5" fill="#1A0A06"/>
<circle cx="76.4" cy="61.9" r="0.6" fill="white"/>
<circle cx="87" cy="62.6" r="1.5" fill="#1A0A06"/>
<circle cx="86.4" cy="61.9" r="0.6" fill="white"/>
<ellipse cx="76" cy="65.8" rx="3.2" ry="2.3" fill="#FFB8C8" opacity="0.55"/>
<ellipse cx="88" cy="65.8" rx="3.2" ry="2.3" fill="#FFB8C8" opacity="0.55"/>
</svg>`

};
