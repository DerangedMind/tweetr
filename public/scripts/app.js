/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
'use strict'

// Test / driver code (temporary). Eventually will get this from the server.
// Fake data taken from tweets.json

function timeSince(date) {
  date = new Date(Date.now() - date)
  var seconds = Math.floor((new Date() - date) / 1000);

  // Seconds are divided by years, months, days, hours, minutes...
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
} 

// On document ready
$(function () {

  // Event handlers
  $('#submit-tweet').on('click', onTweetSubmit) 

  // Handlers --------------------------------------------
  function onTweetSubmit(event) {
    event.preventDefault()

    // validate form is filled, but not over-filled
    let $textarea = $(this).siblings('textarea')
    if ($textarea.val().length <= 0) {
      return alert('You didn\'t enter any text!')
    }
    if ($textarea.val().length >= 140) {
      return alert('Too many characters!')
    }

    // create elements on page
    const $tweetContent = $(this).parent('form').serialize()

    // send POST to /tweets using AJAX
    $.ajax({
      url: `/tweets`,
      method: 'POST',
      data: $tweetContent,
    }).done(function (response) {
        $('#tweets').prepend(createTweetElement(response))

    }).fail(function (jqXHR, textStatus) {
        console.log('tweet post fail')
    })

    // empty textarea
    $textarea.val("")
    $('.new-tweet').slideToggle()
  }

  // <h2>Compose Tweet</h2>

  //  <form action="/tweets" method="POST">
  //    <textarea name="text" placeholder="What are you humming about?"></textarea>
  //    <input id="submit-tweet" type="submit" value="Tweet">
  //    <span class="counter">140</span>
  //  </form>


  // HTML functions ------------------------------------
  function createTweetElement(tweet) {
    let $article = $('<article>', {
      'class': 'tweet'
    })
    
    // Create header section ----------
    let $header = $('<header>')
    let $img = $('<img>', { 
      'class': 'avatar', 
      'src': tweet.user.avatars.small 
    })
    let $h2 = $('<h2>', {
      'text': tweet.user.name
    })
    let $span = $('<span>', { 
      'class': 'username',
      'text': tweet.user.handle 
    })

    $header.append($img, $h2, $span)
    
    // Create tweet contents -----------
    let $content = $('<div>', { 
      'class': 'tweet-content',
      'text': tweet.content.text
    })

    // Create footer contents -----------
    let $footer = $('<footer>')
    let $timestamp = $('<p>', { 
      'class': 'timestamp',
      'text': `${timeSince(tweet.created_at)} ago`
     })

    // Create hidden actions
    let $hiddenActions = $('<span>', {
      'class': 'tweet-actions hidden'
    })
    let $flag = $('<span>', {
      'class': 'fa fa-flag fa-pull-left'
    })
    let $heart = $('<span>', {
      'class': 'fa fa-heart fa-pull-left'
    })
    let $refresh = $('<span>', {
      'class': 'fa fa-refresh fa-pull-left'
    })
    $hiddenActions.append($flag, $heart, $refresh)

    $footer.append($timestamp, $hiddenActions)
    
    // Append all parts of tweet to <article> and return
    return $article.append($header, $content, $footer)
  }  

  function renderTweets(tweets) {
    tweets = tweets.reverse()
    tweets.forEach(function (tweet) {
      $('#tweets').append(createTweetElement(tweet))
    })
  }

  // DB functions ------------------------------------
  function loadTweets() {
    $.ajax({
      url: `/tweets`,
      method: 'GET',
      success: function(tweets) {
        console.log('Success: ' + tweets)
        renderTweets(tweets)
      }
    })
  }

  loadTweets()
})
