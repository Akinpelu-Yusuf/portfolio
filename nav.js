(function () {
  // Don't inject if a nav already exists (index.html has its own)
  if (document.querySelector('nav')) return;

  var html = [
    '<nav style="position:sticky;top:0;z-index:200;background:rgba(229,209,177,0.97);',
    'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);',
    'border-bottom:1px solid rgba(15,14,12,0.15);padding:0 2rem;',
    'font-family:\'DM Mono\',monospace;">',
    '<div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;',
    'justify-content:space-between;height:52px;">',
    '<a href="index.html" style="font-size:0.75rem;letter-spacing:0.12em;',
    'text-transform:uppercase;color:#0f0e0c;text-decoration:none;">Yusuf Akinpelu</a>',
    '<ul style="display:flex;list-style:none;font-size:0.72rem;letter-spacing:0.1em;',
    'text-transform:uppercase;margin:0;padding:0;">',
    '<li><a href="index.html" style="color:#0f0e0c;text-decoration:none;opacity:0.6;',
    'padding:0 0.9rem;display:block;line-height:52px;"',
    ' onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">Home</a></li>',
    '<li><a href="oakland-north.html" style="color:#0f0e0c;text-decoration:none;opacity:0.6;',
    'padding:0 0.9rem;display:block;line-height:52px;"',
    ' onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">Oakland North</a></li>',
    '<li style="position:relative;"',
    ' onmouseenter="this.querySelector(\'ul\').style.display=\'block\'"',
    ' onmouseleave="this.querySelector(\'ul\').style.display=\'none\'">',
    '<a href="bbc.html" style="color:#0f0e0c;text-decoration:none;opacity:0.6;',
    'padding:0 0.9rem;display:block;line-height:52px;"',
    ' onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">BBC &#9662;</a>',
    '<ul style="display:none;position:absolute;top:52px;left:50%;',
    'transform:translateX(-50%);background:rgba(229,209,177,0.99);',
    'backdrop-filter:blur(14px);border:1px solid rgba(15,14,12,0.15);',
    'min-width:195px;list-style:none;padding:0.4rem 0;z-index:300;margin:0;">',
    '<li><a href="bbc.html#features" style="color:#0f0e0c;text-decoration:none;opacity:0.65;',
    'font-size:0.7rem;display:block;padding:0.75rem 1.25rem;line-height:1;"',
    ' onmouseover="this.style.opacity=1;this.style.background=\'rgba(0,0,0,0.05)\'"',
    ' onmouseout="this.style.opacity=0.65;this.style.background=\'\'">Features</a></li>',
    '<li><a href="bbc.html#data" style="color:#0f0e0c;text-decoration:none;opacity:0.65;',
    'font-size:0.7rem;display:block;padding:0.75rem 1.25rem;line-height:1;"',
    ' onmouseover="this.style.opacity=1;this.style.background=\'rgba(0,0,0,0.05)\'"',
    ' onmouseout="this.style.opacity=0.65;this.style.background=\'\'">Data Journalism</a></li>',
    '<li><a href="bbc.html#tv" style="color:#0f0e0c;text-decoration:none;opacity:0.65;',
    'font-size:0.7rem;display:block;padding:0.75rem 1.25rem;line-height:1;"',
    ' onmouseover="this.style.opacity=1;this.style.background=\'rgba(0,0,0,0.05)\'"',
    ' onmouseout="this.style.opacity=0.65;this.style.background=\'\'">TV</a></li>',
    '<li><a href="bbc.html#radio" style="color:#0f0e0c;text-decoration:none;opacity:0.65;',
    'font-size:0.7rem;display:block;padding:0.75rem 1.25rem;line-height:1;"',
    ' onmouseover="this.style.opacity=1;this.style.background=\'rgba(0,0,0,0.05)\'"',
    ' onmouseout="this.style.opacity=0.65;this.style.background=\'\'">Radio / Podcast</a></li>',
    '</ul></li>',
    '<li><a href="premium-times.html" style="color:#0f0e0c;text-decoration:none;opacity:0.6;',
    'padding:0 0.9rem;display:block;line-height:52px;"',
    ' onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">Premium Times</a></li>',
    '<li><a href="dubawa.html" style="color:#0f0e0c;text-decoration:none;opacity:0.6;',
    'padding:0 0.9rem;display:block;line-height:52px;"',
    ' onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">Dubawa</a></li>',
    '</ul></div></nav>',
    '<hr style="max-width:1200px;margin:0 auto;border:none;border-top:3px solid #0f0e0c;">'
  ].join('');

  // Insert at the very top of <body>, before the container div
  document.body.insertAdjacentHTML('afterbegin', html);
})();

