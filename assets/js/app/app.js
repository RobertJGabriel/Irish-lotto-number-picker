var lottoUrl = 'http://resultsservice.lottery.ie/resultsservice.asmx/GetResults';

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
    beforeCompile() {
        sleep(3000);
    },

    mounted: function() {
        this.fetchLotto();
    },

    methods: {
        fetchLotto: function() {
            Vue.http.options.emulateJSON = true;
            this.loading = true;
            this.$http.post(lottoUrl, {
                drawType: 'Lotto',
                lastNumberOfDraws: this.numberOfDraws
            }, {
                emulateJSON: true
            }).then(response => {
                this.numbers = this.getLottoNumbers(response.body);
                this.frequency = this.frequencyOfNumbers(this.numbers);
                this.totalNumbers = this.numbers.length;
                this.loading = false;
            }, response => {
                console.log(response);
            });

        },
        getLottoNumbers(xmlDoc) {
            var sortedNumber = [];
            $(xmlDoc).find('DrawResult').each(function() {

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
        frequencyOfNumbers(numbers) {

            var counts = {};
            numbers = numbers.sort(); //Orders the object contents togeter
            numbers.forEach(function(x) {
                counts[x] = (counts[x] || 0) + 1;
            }); // Gets the Frequency

            var sortable = [];
            for (var key in counts) {
                if (counts.hasOwnProperty(key)) {
                    sortable.push([key, counts[key]]); // each item is an array in format [key, value]
                }
            }
            // sort items by value
            sortable.sort(function(a, b) {
                return a[1] - b[1]; // compare numbers
            });
            return sortable.reverse(); // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
        }
    }

});
