'use strict';

var lottoUrl = 'https://resultsservice.lottery.ie/resultsservice.asmx/GetResults';

function sleep(time) {
    var d1 = new Date().getTime();
    var d2 = new Date().getTime();
    while (d2 < d1 + time) {
        d2 = new Date().getTime();
    }
    return;
}

new Vue({

    el: '#app',
    data: {
        frequency: [],
        numbers: [],
        totalNumbers: 0,
        numberOfDraws: 50,
        loading: false
    },
    mounted: function mounted() {
        this.fetchLotto();
    },

    methods: {
        fetchLotto: function fetchLotto() {
            var _this = this;

            Vue.http.options.emulateJSON = true;
            this.loading = true;
            this.$http.post(lottoUrl, {
                drawType: 'Lotto',
                lastNumberOfDraws: this.numberOfDraws
            }, {
                emulateJSON: true
            }).then(function (response) {
                _this.numbers = _this.getLottoNumbers(response.body);
                _this.frequency = _this.frequencyOfNumbers(_this.numbers);
                _this.totalNumbers = _this.numbers.length;
                _this.loading = false;
            }, function (response) {
                console.log(response);
            });
        },
        getLottoNumbers: function getLottoNumbers(xmlDoc) {
            var sortedNumber = [];
            $(xmlDoc).find('DrawResult').each(function () {

                var el = $(this);
                var winningNumbers = el.find('DrawNumber').text();
                winningNumbers = winningNumbers.replace(/(\r\n|\n|\r)/gm, ""); // Remove new lines
                winningNumbers = winningNumbers.replace(/\D/g, ' '); // Remove non-numeric characters
                winningNumbers = winningNumbers.substr(winningNumbers.indexOf(" ") + 1);
                winningNumbers = winningNumbers.replace(/\s\s+/g, ' '); // Double spaces to one

                var arrayOfWinningNumbers = winningNumbers.split(" ");
                arrayOfWinningNumbers = arrayOfWinningNumbers.filter(Boolean);

                // Loop though the numbers and place them in the array
                for (var i = 0, len = arrayOfWinningNumbers.length; i < len; i++) {
                    sortedNumber.push(arrayOfWinningNumbers[i]);
                }
            });
            return sortedNumber;
        },
        frequencyOfNumbers: function frequencyOfNumbers(numbers) {

            var counts = {};
            numbers = numbers.sort(); //Orders the object contents togeter
            numbers.forEach(function (x) {
                counts[x] = (counts[x] || 0) + 1;
            }); // Gets the Frequency

            var sortable = [];
            for (var key in counts) {
                if (counts.hasOwnProperty(key)) {
                    sortable.push([key, counts[key]]); // each item is an array in format [key, value]
                }
            }
            // sort items by value
            sortable.sort(function (a, b) {
                return a[1] - b[1]; // compare numbers
            });
            return sortable.reverse(); // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
        }
    }

});