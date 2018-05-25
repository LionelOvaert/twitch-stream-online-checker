chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ tabOpened: false }, function () {
        console.log("Component installed");
    });
});

function include(onload) {
    var s = document.createElement("script");
    s.src = "https://code.jquery.com/jquery-3.3.1.min.js";
    s.onload = function (e) {
        onload()
    };
    document.head.appendChild(s);
};

include(function () {
    $(document).ready(function () {


        function pollFunc(fn, timeout, interval) {
            var startTime = (new Date()).getTime();
            interval = interval
            timerOk = true;

            (function p() {
                timerOk = ((new Date).getTime() - startTime) <= timeout;
                if (!fn() && timerOk) { // ensures the function exucutes
                    setTimeout(p, interval);
                }
            })();
        }

        pollFunc(checkOnline, 60000, 900000);

        function checkOnline() {
            console.log('Polling Twitch for OWL')
            chrome.storage.sync.get('tabOpened', (data) => {
                if (data['tabOpened'] === false) {
                    $.ajax({
                        type: "GET",
                        url: 'https://api.twitch.tv/kraken/streams/overwatchleague?client_id=zub43tmi8ysviwt86oi6xjs6allpfh',
                        data: '',
                        success: function (data) {
                            if (data['stream'] != null) {
                                chrome.storage.sync.set({ tabOpened: true }, function () {
                                    window.open('https://www.twitch.tv/overwatchleague', '_blank');
                                });
                            }
                        },
                        error: function (err) {
                            console.log('Error when polling twitch api', err)
                        }
                    })
                }
            });
        }
    })
})

