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
    
    const $tweetContent = $(this).parent('form').serialize()
    
    $.ajax({
      url: `/tweets`,
      method: 'POST',
      data: $tweetContent,
    }).done(function (response) {
        console.log('tweet post sent')
    }).fail(function (jqXHR, textStatus) {
        console.log('tweet post fail')
    })

    let tweet = createTweetData($tweetContent)
    console.log($tweetContent)
    $('#tweets').prepend(createTweetElement(tweet))
  }

  function createTweetData(tweet) {
    let newUser = {
      "user": {
      "name": "Noob Cyoob",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@nublet"
    },
    "content": {
      "text": tweet
    },
    "created_at": Date.now()
    }

    data.push(newUser)
    return newUser
  }

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
    let $heart = $('<span>', {
      'class': 'fa fa-heart fa-pull-left'
    })
    let $repeat = $('<span>', {
      'class': 'fa fa-repeat fa-pull-left'
    })
    let $trash = $('<span>', {
      'class': 'fa fa-trash fa-pull-left'
    })
    $hiddenActions.append($heart, $repeat, $trash)

    $footer.append($timestamp, $hiddenActions)
    
    // Append all parts of tweet to <article> and return
    return $article.append($header, $content, $footer)
  }  

  function renderTweets(tweets) {
    
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
