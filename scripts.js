$(document).ready(function() {
  /* VARIABLES */
  let dataPopularVideos = [];
  let dataLastestVideos = [];

  /* FUNCTIONS */

  function loadQuotes() {
    // request data
    $.ajax({
      method: "GET",
      url: "https://smileschool-api.hbtn.info/quotes",
    })
    .done(function(data) {
      data.forEach(item => {
        let active = "";

        // the first one has the active
        if (item.id == 1) {
          active = "active";
        }

        $("#quotesContent").append(
          '<div class="carousel-item '+ active +'">' +
            '<div class="row">' +
              '<div class="col-12 col-md-4 text-center m-auto">' +
                '<img class="rounded-circle" src="' + item.pic_url +'" alt="Profile 1" width="160" height="160">' +
              '</div>' +
              '<div class="col-12 col-md-8 pt-5 m-auto">' +
                '<p class="text-white font-weight-normal size-p">' + item.text + '</p>' +
                '<p class="text-white font-weight-bold size-p">' + item.name + '</p>' +
                '<p class="text-white font-weight-normal size-p">' + item.title + '</p>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      });

      //hide loader and show content
      $("#loaderQuotes").hide();
      $("#carouselSmile").show();
    });
  }

  function loadCarouselVideos(url, container, loader, variable) {
    $.ajax({
      method: "GET",
      url: url
    })
    .done(function(data) {
      let cnt = 0;

      data.forEach(item => {

        let nextCard = cnt == data.length -1 ? 0 : cnt + 1;
        let prevCard = cnt == 0 ? data.length -1 : cnt - 1;

        let card = $(
          '<div class="card border-0 mr-2" style="width: 16rem;" attr-next="' + nextCard + '" attr-prev="' + prevCard + '">' +
            '<div class="d-flex align-items-center justify-content-center">' +
              '<img src="' + item.thumb_url + '" alt="Video #1" class="card-img-top">' +
              '<img src="images/play.png" alt="Video #1" class="position-absolute w-25">' +
            '</div>' +
            '<div class="card-body">' +
              '<h5 class="card-title font-weight-bold text-dark">' + item.title + '</h5>' +
            '</div>' +
            '<ul class="list-group list-group-flush">' +
              '<li class="list-group-item border-0 color-grey-smile">' + item['sub-title'] + '</li>' +
              '<li class="list-group-item d-flex align-item-center border-0">' +
                '<img class="rounded-circle" src="' + item.author_pic_url + '" alt="Profile 1" width="30" height="30">' +
                '<p class="pl-3 color-smile my-auto">' + item.author + '</p>' +
              '</li>' +
              '<li class="list-group-item d-flex border-0">' +
                '<div class="col-8 text-left pl-0">' +
                  '<img src="images/star_on.png" width="23">' +
                  '<img src="images/star_on.png" width="23">' +
                  '<img src="images/star_on.png" width="23">' +
                  '<img src="images/star_on.png" width="23">' +
                  '<img src="images/star_off.png" width="23">' +
                '</div>' +
                '<div class="col-4 color-smile text-right pt-1 px-0">' +
                  '<span>' + item.duration + '</span>' +
                '</div>' +
              '</li>' +
            '</ul>' +
          '</div>'
        );
        
        variable.push(card);
        cnt++;
      });

      //fill cards
      slidesCards("", container, variable);

      //hide loader
      $("#" + loader).hide();
    })
  }

  function itemToShow() {
    let size = $(window).width()

    if (size >= 1200)
      return 4;
    else if (size >= 992 && size <= 1199)
      return 3;
    else if (size >= 528 && size <= 991)
      return 2;
    else
      return 1;
  }

  function slidesCards(action, container, variable) {

    let itemtoShow = itemToShow();
    let shownItems = $("#" + container).children().length;

    if (action.localeCompare("") === 0) {
      for (let cnt = 0; cnt < itemtoShow; cnt++) {
        $("#" + container).append(variable[cnt]);
      }
    } else if (action.localeCompare("next") === 0 && shownItems != variable.length) {
      let nextCard = parseInt($("#" + container + " .card").last().attr("attr-next"));
      $("#" + container + " .card").first().remove();
      $("#" + container).append(variable[nextCard]);
    } else if(action.localeCompare("prev") === 0 && shownItems != variable.length) {
      let prevCard = parseInt($("#" + container + " .card").first().attr("attr-prev"))
      $("#" + container + " .card").last().remove();
      $("#" + container).prepend(variable[prevCard]);
    } else if (action.localeCompare("resize") == 0) {
      if (shownItems > itemtoShow) {
        for (let cnt = 0; cnt < shownItems - itemtoShow; cnt++) {
          $("#" + container + " .card").last().remove();
        }
      } else {
        for (let cnt = 0; cnt < itemtoShow - shownItems; cnt++) {
          let nextCard = $("#" + container + " .card").last().attr("attr-next");
          $("#" + container).append(variable[nextCard]);
        }
      }
    }
  }

  function dataCourses(action) {
    let search = "";
    let sortBy = "";
    let topic = "";

    if (action.localeCompare("search") == 0) {
      search = $("#keywords").val();
      sortBy = $("#sortSelected").val();
      topic = $("#topicSelected").val();
    }

    $.ajax({
      method: "GET",
      url: "https://smileschool-api.hbtn.info/courses",
      data: {
        q: search,
        topic: topic,
        sort: sortBy
      }
    })
    .done(function(data){
      if (action.localeCompare("dropdown") == 0) {
        // topic option
        $("#topic").html(data.topics[0]);
        data.topics.forEach(item => {
          let option = $('<a class="dropdown-item">' + item + '</a>');
          $("#topicInput").append(option)
          $(option).click(function() {
            $("#topic").html($(this).html());
            $("#topicSelected").val($(this).html());
            dataCourses("search");
          });
        });

        // sort options
        $("#sort").html(data.topics[0]);
        data.sorts.forEach(item => {
          let option = $('<a class="dropdown-item" attr-val="' + item + '">' + item.replace("_", " ") + '</a>');
          $("#sortbyInput").append(option);
          $(option).click(function() {
            $("#sort").html($(this).html());
            $("#sortSelected").val($(this).attr("attr-val"));
            dataCourses("search");
          });
        });
      } else {
        $("#numberOfVideos").html(data.courses.length + " video(s)");
        $("#results").html("");

        data.courses.forEach(item => {
          let card = 
            '<div class="d-flex col-12 col-sm-6 col-md-4 col-lg-3 px-sm-0">' +
              '<div class="card border-0 ml-2">' +
                '<div class="d-flex align-items-center justify-content-center">' +
                  '<img src="' + item.thumb_url + '" alt="Video #1" class="card-img-top">' +
                  '<img src="images/play.png" alt="Video #1" class="position-absolute w-25">' +
                '</div>' +
                '<div class="card-body">' +
                  '<h5 class="card-title font-weight-bold text-dark">' + item.title + '</h5>' +
                '</div>' +
                '<ul class="list-group list-group-flush">' +
                  '<li class="list-group-item border-0 color-grey-smile">' + item['sub-title'] + '</li>' +
                  '<li class="list-group-item d-flex align-item-center border-0">' +
                    '<img class="rounded-circle" src="' + item.author_pic_url + '" alt="Profile 1" width="30" height="30">' +
                    '<p class="pl-3 color-smile my-auto">' + item.author + '</p>' +
                  '</li>' +
                  '<li class="list-group-item d-flex border-0">' +
                    '<div class="col-8 text-left pl-0">' +
                      '<img src="images/star_on.png" width="23">' +
                      '<img src="images/star_on.png" width="23">' +
                      '<img src="images/star_on.png" width="23">' +
                      '<img src="images/star_on.png" width="23">' +
                      '<img src="images/star_off.png" width="23">' +
                    '</div>' +
                    '<div class="col-4 color-smile text-right pt-1">' +
                      '<span>' + item.duration + '</span>' +
                    '</div>' +
                  '</li>' +
                '</ul>' +
              '</div>' +
            '</div>';

            $("#results").append(card);
        });
      }
    });
  }

  /* GENERAL CALLS */

  // auto slide false
  $('.carousel').carousel({
    interval: false,
  });

  // hide all the content inside the carousel
  $("#carouselSmile").hide();

  /* FUNCTION CALLS */

  // load data
  setTimeout(function(){
    // load the quuotes
    loadQuotes()
    // load popular videos and latest videos
    loadCarouselVideos("https://smileschool-api.hbtn.info/popular-tutorials", "popularVideosContent", "loaderPopularVideos", dataPopularVideos);
    loadCarouselVideos("https://smileschool-api.hbtn.info/latest-videos", "latestVideosContent", "loaderLatestVideos", dataLastestVideos);
  }, 1000);

  // load popular videos resize
  $(window).resize(function() {
    slidesCards("resize", "popularVideosContent", dataPopularVideos);
    slidesCards("resize", "latestVideosContent", dataLastestVideos);
  });

  // next popular videos
  $("#pv-next").click(function(){
    slidesCards("next", "popularVideosContent", dataPopularVideos);
  });

  // previous popular videos
  $("#pv-prev").click(function() {
    slidesCards("prev", "popularVideosContent", dataPopularVideos);
  });

  // next lates videos
  $("#lv-next").click(function(){
    slidesCards("next", "latestVideosContent", dataLastestVideos);
  });

  // previous latest videos
  $("#lv-prev").click(function() {
    slidesCards("prev", "latestVideosContent", dataLastestVideos);
  });

  // load dropdown
  dataCourses("dropdown");
  dataCourses("search");

  // search action
  $("#keywords").change(function() {
    dataCourses("search");
  });
});