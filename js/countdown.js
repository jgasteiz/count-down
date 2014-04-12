/**
 * Counter directive formed by:
 *
 * - h1 element with the remaining time, being showed only when the
 * countdown is in progress.
 * - time input for changing the countdown time.
 * - begin button for starting or resuming a countdown.
 * - pause button for pausing a countdown.
 * - audio element which will autoplay when the countdown is over.
 */
countDown.app.directive("counter", function($interval) {
    return {
        restrict: "E",
        scope: {},
        template:
            '<h1 ng-show="countDownInProgress" id="time">{{time}}</h1>' +
            '<div ng-hide="countDownFinished">' +
                '<input ng-hide="countDownInProgress" id="time-input" type="time" ng-model="time" step="1"/>' +
                '<button ng-show="countDownInProgress" class="centre-button" ng-click="pauseCountDown()">Pause</button>' +
                '<button ng-hide="countDownInProgress" class="centre-button" ng-click="beginCountDown()">Begin</button>' +
            '</div>' +
            '<div ng-show="countDownFinished" class="audio">' +
                '<audio src="audio/alarm.mp3"></audio>' +
            '</div>',
        link: function(scope, element) {

            var _intervalId,
                _audio = element.find('audio')[0];

            /**
             * Parses a string and returns an object with integers for hours,
             * minutes and seconds.
             *
             * @param time - String, expected format: 'H[H]:M[M]:S[S]'
             * @returns {{hours: Number, minutes: Number, seconds: Number}}
             * @private
             */
            var _parseTime = function(time) {

                var splitTime = time.split(':'),
                    hours = splitTime[0] || 0,
                    minutes = splitTime[1] || 0,
                    seconds = splitTime[2] || 0;

                return {
                    hours: parseInt(hours),
                    minutes: parseInt(minutes),
                    seconds: parseInt(seconds)
                };
            };

            /**
             * Given an object with integers for hours, minutes and seconds,
             * this method will decrease one second the time.
             *
             * @param splitTime
             * @returns {*} - same received object with a second less or 0 if done.
             * @private
             */
            var _decreaseTime = function(splitTime) {
                var hours = splitTime.hours,
                    minutes = splitTime.minutes,
                    seconds = splitTime.seconds;

                if (seconds === 0) {
                    if (minutes === 0) {
                        if (hours === 0) {
                            return 0;
                        } else {
                            hours = hours - 1;
                            minutes = 59;
                            seconds = 59;
                        }
                    } else {
                        minutes = minutes - 1;
                        seconds = 59;
                    }
                } else {
                    seconds = seconds - 1;
                }
                return {
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                };
            };

            /**
             * Given an object with integers for hours, minutes and seconds, this
             * method will format the time as a string with the format 'HH:MM:SS'.
             *
             * @param splitTime
             * @returns {string}
             * @private
             */
            var _formatTime = function(splitTime) {
                var formattedTime = '';

                if (String(splitTime.hours).length === 1) {
                    formattedTime = formattedTime + '0' + String(splitTime.hours);
                } else {
                    formattedTime = formattedTime + String(splitTime.hours);
                }

                formattedTime = formattedTime + ':';
                if (String(splitTime.minutes).length === 1) {
                    formattedTime = formattedTime + '0' + String(splitTime.minutes);
                } else {
                    formattedTime = formattedTime + String(splitTime.minutes);
                }

                formattedTime = formattedTime + ':';
                if (String(splitTime.seconds).length === 1) {
                    formattedTime = formattedTime + '0' + String(splitTime.seconds);
                } else {
                    formattedTime = formattedTime + String(splitTime.seconds);
                }

                return formattedTime;
            };

            /**
             * Clears the interval and set the variable `countDownFinished` to true.
             * @private
             */
            var _stopCountDown = function() {
                $interval.cancel(_intervalId);
                scope.countDownFinished = true;
            }


            scope.time = '00:00:00';
            scope.countDownInProgress = false;
            scope.countDownFinished = false;

            /**
             * Begins the countdown with the current time value.
             */
            scope.beginCountDown = function() {
                scope.countDownInProgress = true;

                var splitTime = _parseTime(scope.time);

                _intervalId = $interval(function() {
                    splitTime = _decreaseTime(splitTime);

                    if (splitTime === 0) {
                        _stopCountDown();
                    } else {
                        scope.time = _formatTime(splitTime);
                    }
                }, 1000);
            };

            /**
             * Pauses the countdown and clears the interval.
             */
            scope.pauseCountDown = function() {
                scope.countDownInProgress = false;
                $interval.cancel(_intervalId);
            };

            /**
             * Watches for the countDown to be finished to play the audio.
             */
            scope.$watch('countDownFinished', function(newValue) {
                if (newValue === true) {
                    _audio.play();
                }
            });
        }
    }
});