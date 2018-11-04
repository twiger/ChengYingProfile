var app = angular.module('colors', []);

app.controller('impactReportCtrl', function($scope, $http, $log) {

    $('.modal').modal();
    // $('select').material_select();

    report_id = getParameterByName("id");

    url = "/web/res/data/AWARE_data.json"
    console.log("Http Request: %s ", url);

    $http({
        method: "GET",
        url: url
    }).then(function onSuccess(response) {

        // Materialize.toast('Sum of API Usage: 20', 50000);

        console.log("Http Request %s - response:", url);
        var result = response.data;
        console.log(result);

        var api_change_tree = result.impact_report.api_change_tree;
        var top5_api_change = result.impact_report.top5_api_change;
        var total_programs = result.impact_report.total_programs;

        var threshold, offset;

        console.log(localStorage.getItem("threshold"));
        console.log(localStorage.getItem("offset"));

        if (localStorage.getItem("threshold") === 'undefined' || localStorage.getItem("offset") === 'undefined' || localStorage.getItem("threshold") == null || localStorage.getItem("offset") == null) {
            threshold = 5;
            offset = 4;
        } else {
            threshold = localStorage.getItem("threshold");
            offset = localStorage.getItem("offset");
        }

        $scope.api_change_tree = api_change_tree;
        $scope.top5_api_change = top5_api_change;
        $scope.threshold = threshold;
        $scope.offset = offset;

        // console.log(api_change_tree);

        $('#api_change_tree').jstree({
                "core": {
                    "data": api_change_tree.core.data
                },
                "type": {
                    "types": {
                        "default": {
                            "select_node": function(e) {
                                this.toggle_node(e);
                                return false;
                            }

                        }
                    }
                },
                "plugins": ["ui"]
            }, false)
            .bind('select_node.jstree', function(ev, data) {
                console.log('clicked');
                console.log(data.node.data);
                $scope.node_data = data.node.data;
                angular.element('#click_node_triggrt').trigger('click');
            })
            .bind('ready.jstree', function(event, data) {
                var $tree = $(this);
                $($tree.jstree().get_json($tree, {
                        flat: true
                    }))
                    .each(function(index, value) {
                        var node = $("#api_change_tree").jstree().get_node(this.id);
                        // var lvl = node.parents.length;
                        // var idx = index;
                        // console.log('node index = ' + idx + ' level = ' + lvl);
                        // console.log(node.data.impact_stats);

                        // var affected_programs = node.data.impact_stats.summary.affected_program;
                        // console.log(data);
                        var sum = $scope.getSumOfMetric(node.data.impact_stats.summary.metric);
                        // console.log(sum);
                        // var precentage = (affected_programs * 1.0 / total_programs) * 100;

                        if (sum > threshold) {
                            $('#' + node.id).addClass("red-text");
                        } else if (sum < threshold && sum > (threshold - offset)) {
                            $('#' + node.id).addClass("orange-text");
                        } else {
                            $('#' + node.id).addClass("black-text");
                        }
                    });
            });


        $scope.decideStatus = function(affected_programs) {
            // console.log(affected_programs);
            // console.log(total_programs);
            var precentage = (affected_programs * 1.0 / total_programs) * 100;
            // console.log(precentage);

            if (precentage > threshold) {
                return "/res/img/icon/alert2.png"
            } else if (precentage < threshold && precentage > (threshold - offset)) {
                return "/res/img/icon/aware.png"
            } else {
                return "/res/img/icon/tick.png"
            }
        }


        $scope.oepnImpactDetail = function(api_change) {
            console.log("API change:");
            console.log(api_change);
            var affected_programs = api_change.impact_stats.summary.affected_program;
            var precentage = ((affected_programs * 1.0 / total_programs) * 100).toFixed(2);
            // var annotations = api_change.annotations;
            // console.log("Annotation:");
            // console.log(annotations);

            $scope.impact_detail = api_change;
            $scope.impact_detail.select_project = "Summary";
            // console.log($scope.impact_detail);
            $scope.impact_detail["display_project"] = {
                "name": "Summary",
                "metric": $scope.getSortedFilteredMetricList(api_change.impact_stats.summary.metric),
                "sum": $scope.getSumOfMetric(api_change.impact_stats.summary.metric)
            }

            // if (annotations.indexOf('@Deprecated') >= 0) 
            //     $scope.impact_detail["API_lifecycle_model"] = "Deprecation Involved Model";
            // else
            //     $scope.impact_detail["API_lifecycle_model"] = "Non-deprecation Involved Model: Removal stage";

            if (precentage > threshold) {
                $scope.impact_detail["summary"] = "This API should go through the lifecycle of D Model and stay in deprecation stage! (USR: " + precentage + "% > " + threshold + "% )";
                $scope.impact_detail["summary_style"] = "red-text";

            } else if (precentage < threshold && precentage > (threshold - offset)) {
                $scope.impact_detail["summary"] = "The impact of this API removal decision is close to the threshold. Be aware of this API removal and make a appropriate decision. ( " + threshold + "% > " + precentage + "% > " + (threshold - offset) + "% )";
                $scope.impact_detail["summary_style"] = "orange-text";
            } else {
                $scope.impact_detail["summary"] = "This API can enter removal stage. ( " + (threshold - offset) + "% > " + precentage + "% )";
                $scope.impact_detail["summary_style"] = "green-text";
            }
            $scope.impact_detail["precentage"] = affected_programs.toString() + " (# of affected client programs) / " + total_programs.toString() + " (# of total programs) = " + precentage.toString() + " %";
            // console.log($scope.impact_detail.impact_stats["client_projects"])
            $scope.impact_detail.impact_stats["client_project_view"] = []

            // console.log($scope.impact_detail);
            $('#impact_detail').modal('open');

        }

        $scope.getMetricInfo = function(metric_name, key) {
            return metric_dict[metric_name][key];
        }

        // $scope.changeMetricView = function() {
        //     console.log("changeMetricView");
        //     // console.log($scope.impact_detail.select_project);
        //     select_project_name = $scope.impact_detail.select_project;
        //     sorted_projects = $scope.impact_detail.impact_stats.sorted_projects
        //     if (select_project_name == "Summary") {
        //         $scope.impact_detail.display_project = {
        //             "name": "Summary",
        //             "metric": $scope.getSortedFilteredMetricList($scope.impact_detail.impact_stats.summary.metric)
        //         }
        //         // console.log( $scope.impact_detail.display_project);
        //     }
        //     for (i = 0; i < sorted_projects.length; i++) {
        //         if (select_project_name == sorted_projects[i].name) {
        //             console.log("Change to %s", sorted_projects[i].name)
        //             $scope.impact_detail.display_project = {
        //                 "name": sorted_projects[i].name,
        //                 "metric": $scope.getSortedFilteredMetricList(sorted_projects[i].metric)
        //             }
        //         }
        //     }
        // }

        $scope.getSumOfMetric = function(metric_dict) {
            var sum = 0;

            var metric_keys = Object.keys(metric_dict);
            for (var i = 0; i < metric_keys.length; i++) {
                var key = metric_keys[i];
                sum = sum + metric_dict[key];
            }

            return sum;
        }


        $scope.getSortedFilteredMetricList = function(metric_dict) {
            // console.log(metric_dict);
            sorted_metric_list = []
            if (metric_dict) {
                var metric_keys = Object.keys(metric_dict);
                for (var i = 0; i < metric_keys.length; i++) {
                    // console.log(metric_keys[i]);
                    var key = metric_keys[i];
                    if (metric_dict[key] > 0) {
                        sorted_metric_list.push({
                            "name": key,
                            "value": metric_dict[key]
                        });
                    }
                }
                // console.log(sorted_metric_list);
                sorted_metric_list = sorted_metric_list.sort(function(a, b) {
                    return b.value - a.value;
                });
                // console.log(sorted_metric_list);
                return sorted_metric_list
            }
        }

        $('#threshold_setting').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .75, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '4%', // Starting top style attribute
            endingTop: '10%', // Ending top style attribute
            ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
                // alert("Ready");
                console.log("Open the thredhold setting.");
            },
            complete: function() {
                // alert('Closed'); 
                console.log("Close it.");
                localStorage.setItem("threshold", $scope.temp_threshold);
                localStorage.setItem("offset", $scope.temp_offset);
                location.reload();
            } // Callback for Modal close
        });

        $scope.closeThresholdSetting = function() {
            $('#threshold_setting').modal('close');
        }

    })
    // .catch(function onError(response) {
    //     // Handle error
    //     console.log("Something go wrong!");
    // });

});


var metric_dict = {
    "IPcMetric": {
        "name": "NCIP",
        "type": "type",
        "scenarios": "Import",
        "criteria": ["Number of times of a Class being ImPorted."]
    },
    "FDcMetric": {
        "name": "NCDF",
        "type": "type",
        "scenarios": "Fields declaration",
        "criteria": ["Number of times of a Class being Declared as Field of a class."]
    },
    "VDcMetric": {
        "name": "NCDV",
        "type": "type",
        "scenarios": "Variable declaration",
        "criteria": ["Number of times of a Class being Declared as Variable in method's body."]
    },
    "SUcMetric": {
        "name": "NCSM",
        "type": "type",
        "scenarios": "Static type use",
        "criteria": ["Number of times of a Class being used through its Static Member."]
    },
    "PUcMetric": {
        "name": "NCDP",
        "type": "type",
        "scenarios": "Parameter use",
        "criteria": ["Number of times of a Class being Declared as Parameter of a method."]
    },
    "GTcMetric": {
        "name": "NCDG",
        "type": "type",
        "scenarios": "Generic use",
        "criteria": ["Number of times of a Class being used as a Generic type."]
    },
    "IMiMetric": {
        "name": "NCIM",
        "type": "interface",
        "scenarios": "Implement interfaces",
        "criteria": [
            "Number of times of a Class being IMplemented."
        ]
    },
    "EXcMetric": {
        "name": "NCEX",
        "type": "type",
        "scenarios": "Extends use",
        "criteria": [
            "Number of times of a Class being EXtended."
        ]
    },
    "RTcMetric": {
        "name": "NCRM",
        "type": "type",
        "scenarios": "Return type use",
        "criteria": ["Number of times of a Class being used to define Return type of a Method."]
    },
    "CLcMetric": {
        "name": "NCLI",
        "type": "type",
        "scenarios": "Class literal use",
        "criteria": ["Number of times of a Class being used through its LIteral."]
    },
    "DCcMetric": {
        "name": "NCEC",
        "type": "type",
        "scenarios": "Explicit casting",
        "criteria": ["Number of times of a Class being used on Explicit Casting."]
    },
    "IScMetric": {
        "name": "TC",
        "type": "type",
        "scenarios": "Type checking",
        "criteria": ["Use “instanceof” operator to check whether the type of a variable is the same with the type API."]
    },
    "ANcMetric": {
        "name": "AR",
        "type": "type",
        "scenarios": "Annotation argument use",
        "criteria": ["The type API is used in annotation arguments."]
    },
    "ANaMetric": {
        "name": "NCAC",
        "type": "annotation",
        "scenarios": "Annotation use",
        "criteria": ["Number of times of a Class being used in Annotation."]
    },
    "EXeMetric": {
        "name": "NCCE",
        "type": "exception",
        "scenarios": "Catching exceptions",
        "criteria": ["Number of times of a Class being used to Catch Exception."]
    },
    "THeMetric": {
        "name": "NCTE",
        "type": "exception",
        "scenarios": "Throwing exceptions",
        "criteria": [
            "Number of times of a Class being used to Throw Exception."
        ]
    },
    "INmMetric": {
        "name": "NMIN",
        "type": "method",
        "scenarios": "Static/instance method invocation",
        "criteria": ["Number of times of a Method (not constructor) being INvoked."]
    },
    "OVmMetric": {
        "name": "NMOV",
        "type": "method",
        "scenarios": "Method overriding",
        "criteria": [
            "Number of times of a Method being OVerrided."
        ]
    },
    "IMmMetric": {
        "name": "NMIM",
        "type": "method",
        "scenarios": "Method implementation",
        "criteria": [
            "Number of times of a Method being IMplemented."
        ]
    },
    "CNrMetric": {
        "name": "NMIO",
        "type": "constructor",
        "scenarios": "Constructor invocation",
        "criteria": ["Number of times of a Method (constructor) being invoked to Instantiate Object from its class."]
    },
    "ACfMetric": {
        "name": "NFAC",
        "type": "field",
        "scenarios": "Static/instance field access",
        "criteria": ["Number of times of a Filed being ACcessed."]
    }
}