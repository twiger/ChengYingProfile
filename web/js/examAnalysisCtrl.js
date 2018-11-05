var app = angular.module('colors', []);

app.controller('examAnalysisCtrl', function($scope, $http) {

    console.log("In examAnalysisCtrl...");

    $http({
        method: 'GET',
        url: "/web/res/data/exam_data.json"
    }).
    then(function(data, status, headers, config) {
        // console.log("Get JSON...");
        // console.log(data.data);
        exam_statics = data.data.exam_statics;
        exam_doc = data.data.exam_doc;

        // console.log(exam_doc);

        $scope.exam_doc = exam_doc;

        var keys = [],
            k, i, len;

        for (k in exam_doc.practices) {
            if (exam_doc.practices.hasOwnProperty(k)) {
                keys.push(k);
            }
        }

        keys.sort(SortByID);

        function SortByID(x, y) {
            return x - y;
        }

        var barData = {
            labels: ["記憶", "了解", "應用", "分析", "評鑑", "創造"],
            datasets: [{
                fillColor: "rgba(15,159,159,0.5)",
                strokeColor: "rgba(15,159,159,0.8)",
                highlightFill: "rgba(15,159,159,0.75)",
                highlightStroke: "rgba(15,159,159,1)",
                data: [exam_statics.memory_correct_quantity[0], exam_statics.memory_correct_quantity[1], exam_statics.memory_correct_quantity[2], exam_statics.memory_correct_quantity[3], exam_statics.memory_correct_quantity[4], exam_statics.memory_correct_quantity[5]]
            }]

        }

        var barData2 = {
            labels: ["難", "中", "易"],
            datasets: [{
                    fillColor: "rgba(151,187,205,0.6)",
                    strokeColor: "rgba(151,187,205,0.9)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: [exam_statics.felt_difficult_type_quantity[0], exam_statics.felt_difficult_type_quantity[1], exam_statics.felt_difficult_type_quantity[2]]
                },
                {
                    fillColor: "rgba(255,0,0,0.5)",
                    strokeColor: "rgba(255,0,0,0.8)",
                    highlightFill: "rgba(255,0,0,0.6)",
                    highlightStroke: "rgba(255,0,0,0.9)",
                    data: [exam_statics.real_difficulty_quantity[0], exam_statics.real_difficulty_quantity[1], exam_statics.real_difficulty_quantity[2]]
                }
            ]

        }

        var barData3 = {
            labels: ["9-s-14", "9-s-15", "9-d-01", "9-d-02", "9-d-04", "9-d-0", "9-d-05", "9-s-16"],
            datasets: [{
                fillColor: "rgba(15,159,159,0.5)",
                strokeColor: "rgba(15,159,159,0.8)",
                highlightFill: "rgba(15,159,159,0.75)",
                highlightStroke: "rgba(15,159,159,1)",
                data: [exam_statics.item_type_quantity[0], exam_statics.item_type_quantity[1], exam_statics.item_type_quantity[2], exam_statics.item_type_quantity[3], exam_statics.item_type_quantity[4], exam_statics.item_type_quantity[5], exam_statics.item_type_quantity[6], exam_statics.item_type_quantity[7]]
            }]

        }

        var barData4 = {
            labels: ["9-s-14", "9-s-15", "9-d-01", "9-d-02", "9-d-04", "9-d-0", "9-d-05", "9-s-16"],
            datasets: [{
                fillColor: "rgba(255,51,0,0.5)",
                strokeColor: "rgba(255,51,0,0.8)",
                highlightFill: "rgba(255,51,0,0.75)",
                highlightStroke: "rgba(255,51,0,1)",
                data: [exam_statics.item_correct_quantity[0], exam_statics.item_correct_quantity[1], exam_statics.item_correct_quantity[2], exam_statics.item_correct_quantity[3], exam_statics.item_correct_quantity[4], exam_statics.item_correct_quantity[5], exam_statics.item_correct_quantity[6], exam_statics.item_correct_quantity[7]]
            }]

        }

        var lineCharData = {
            labels: ["-1~-0.8", "-0.8~-0.6", "-0.6~-0.4", "-0.4~-0.2", "-0.2~0", "0~0.2", "0.2~0.4", "0.4~0.6", "0.6~0.8", "0.8~1"],
            datasets: [{
                label: "My First dataset",
                fillColor: "rgba(102,153,153,0.5)",
                strokeColor: "rgba(102,153,153,1)",
                pointColor: "rgba(102,153,153,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: [exam_statics.discrimination[0], exam_statics.discrimination[1], exam_statics.discrimination[2], exam_statics.discrimination[3], exam_statics.discrimination[4], exam_statics.discrimination[5], exam_statics.discrimination[6], exam_statics.discrimination[7], exam_statics.discrimination[8], exam_statics.discrimination[9]]
            }]
        };

        var ctx = document.getElementById("memory-correct").getContext("2d");
        window.myBar = new Chart(ctx).Bar(barData);
        var ctx = document.getElementById("real-difficulty").getContext("2d");
        window.myBar = new Chart(ctx).Bar(barData2);
        var ctx = document.getElementById("discrimination").getContext("2d");
        window.myLine = new Chart(ctx).Line(lineCharData);
        var ctx = document.getElementById("Item").getContext("2d");
        window.myBar = new Chart(ctx).Bar(barData3);
        var ctx = document.getElementById("item_correct").getContext("2d");
        window.myBar = new Chart(ctx).Bar(barData4);
    });

});