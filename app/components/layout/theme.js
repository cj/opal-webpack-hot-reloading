require('theme/jQuery/jquery-migrate-1.2.1.min.js');
require('theme/bootstrap/js/bootstrap.min.js');
require('theme/js/dropdown-menu/dropdown-menu.js');
require('theme/js/fancybox/jquery.fancybox.pack.js');
require('theme/js/fancybox/jquery.fancybox-media.js');
require('theme/js/jquery.fitvids.js');
require('theme/js/jquery.easy-pie-chart.js');
require('theme/js/theme.js');

jQuery(document).on('pjax:complete', function() {
  require('theme/js/theme.js');

  CHEF.initMainMenu(); // init main menu
  CHEF.mobileNav(); // create mobile nav menu
  CHEF.listenerMenu(); // toggle mobile nav
  CHEF.IEpatches(); // set of patches relating to IE
  CHEF.topSearchToggle(); // toggle top-search
  CHEF.googleMaps(); // Google Maps
  CHEF.fancyBoxer(); // fancybox
  CHEF.responsiveVideos(); // fitVids
  CHEF.responsiveAudios(); // audio player
  CHEF.pieChartz(); // easy pie charts
});
