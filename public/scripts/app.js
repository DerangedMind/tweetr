'use strict'

// Returns how long ago the time was
function timeSince(date) {
  // Find difference between now and time of posting
  date = new Date(Date.now() - date)
  var seconds = Math.floor(date / 1000);

  // Seconds are divided by years, months, days, hours, minutes...
  var interval = Math.floor(seconds / 31449600);
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

  // Assign handlers
  $('#submit-tweet').on('click', onTweetSubmit) 
  $('.new-tweet textarea').keydown(function(e){
    if ((e.ctrlKey || e.metaKey) && (e.keyCode == 13 || e.keyCode == 10)) {
    onTweetSubmit(e)
    }
  })

  // Handlers --------------------------------------------
  function onTweetSubmit(e) {
    e.preventDefault()

    let $textarea = $('#submit-tweet').siblings('textarea')
    
    // validate form is filled, but not over-filled
    if ($textarea.val().length <= 0) {
      return alert('You didn\'t enter any text!')
    }
    if ($textarea.val().length >= 140) {
      return alert('Too many characters!')
    }

    // serialize tweet contents
    const $tweetContent = $textarea.parent('form').serialize()

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

  function toggleLike(tweet) {
    let tweetID = tweet.data('tweetId')
    let tweetCount = Number(tweet.find('.fa-heart span').text())
    tweetCount = tweetCount ? tweetCount : 0
    if (!tweet.hasClass('liked')) {
      $.ajax({
        url: `/tweets/${tweetID}`,
        method: 'POST',
        data: tweetID 
      }).done(function (response) {
        if (response) {
          console.log(response)
          tweet.toggleClass('liked')
          tweet.find('.fa-heart span').text(tweetCount + 1)
        }
      })
    }
    else {
      $.ajax({
        url: `/tweets/${tweetID}/unlike`,
        method: 'POST',
        data: tweetID
      }).done(function (response) {
        if (response) {
          console.log(response)
          tweet.toggleClass('liked')
          tweet.find('.fa-heart span').text(tweetCount - 1)
        }
      })
    }
  }

  // Create individual tweet ------------------------------------
  function createTweetElement(tweet) {
    let $article = $('<article>', {
      'class': 'tweet',
      'data-tweet-id': tweet._id
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
    let $refresh = $('<span>', {
      'class': 'fa fa-refresh fa-pull-left'
    })
    let $heart = $('<span>', {
      'class': 'fa fa-heart fa-pull-left'
    }).append(`<span> ${tweet.likes}</span>`)

    
    $heart.on('click', function(e) {
      toggleLike($(this).parents('article'))
    })

    $hiddenActions.append($flag, $refresh, $heart)
    $footer.append($timestamp, $hiddenActions)
    $article.append($header, $content, $footer)

    
    // Append all parts of tweet to <article> and return
    return $article
  }  

  // Loop to create each tweet
  function renderTweets(tweets) {
    tweets = tweets.reverse()
    tweets.forEach(function (tweet) {
      let tweetHTML= $('#tweets').append(createTweetElement(tweet))
    })

    
  }

  // loadTweets from DB ------------------------------------
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
