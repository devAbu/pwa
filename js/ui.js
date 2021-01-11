document.addEventListener("DOMContentLoaded", function () {
  var sidenav = document.querySelectorAll(".sidenav");
  var modals = document.querySelectorAll(".modal");
  var fab = document.querySelectorAll(".fixed-action-btn");
  M.Sidenav.init(sidenav);
  M.Modal.init(modals);
  M.FloatingActionButton.init(fab);
});
