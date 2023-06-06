/**
 * Created by dany on 2016/7/30.
 */
var DVL = {
   pie: function($selector, data) {
       data = model.change(data , 3);
       return drawPie($selector, data[0]);
   } ,
    line: function($selector, data) {
        data = model.change(data , 2);
        drawLine($selector, data);
    },
    basicChart: function($selector, data) {
        data = model.change(data , 1);
        drawBasicBar($selector,data);
    },
    horizChart: function($selector, data) {
        data = model.change(data , 1);
        drawHorizBar($selector,data)
    },
    timeLine: function($selector, data) {
        var data0 = model.change(data, 4);
        console.log(data0);
        drawTimeline($selector, data0)
    },
    parallel: function($selector, data) {
       data = model.change(data, 5);
        drawParallel($selector, data);
    },
    map: function($selector, data) {
        data = model.change(data, 8);
        drawMapArea($selector, data);
    },
    tree: function($selector, data) {
        data = model.change(data, 6);
        var width = $selector.width()*0.9;
        var height = 500;
        //边界空白
        var padding = {left: 80, right:50, top: 20, bottom: 20 };
        //创建svg容器
        var svg = d3.select('.'+$selector.attr('id '))
            .append("svg")
            .attr("id","svgTree")
            .attr("width", width)
            .attr("height", height + padding.top + padding.bottom);
        var svgcontainer= svg.append("g")
            .attr("transform","translate("+ padding.left + "," + padding.top + ")");

        drawTree(width,height,svgcontainer,data);
    },
    ford: function($selector, data) {
        data = model.change(data, 7);
        var width  = $selector.width();	//SVG绘制区域的宽度
        var height = 500;	//SVG绘制区域的高度

        var svg = d3.select('.'+$selector.attr('id'))			//选择<body>
            .append("svg").attr("id","svgFord")			//在<body>中添加<svg>
            .attr("width", width)	//设定<svg>的宽度
            .attr("height", height)//设定<svg>的高度
            .attr("background-color","#fff")
            .attr("border-radius","15px");
        //1.确定初始数据
        var ford = model.change(data, 7);
        drawFord(svg,width,height,data.nodes,data.edges);
    },
    word: function($selector, data) {
       var word = model.change(data, 9);
        drawWord($selector, wordData);
    }
};
var model = {
    'change': function(data, index) {
        var $this = this;
        if(data) {
            index = parseInt(index, 10);
            relationtype = parseInt(data.relationtype, 10);
            //console.log(data);
            //console.log(match(data, index));
            if(index !== 0) {

                // relationtype 1 yiwei 2 2wei  3 duowei 4 shijian 5 cengci 6 wangluo 7 map 8 zi
                // index 1 Bar  2: Line 3: Pie 4: Timeline 5 Parallel 6: Tree 7: Ford 8: map 9:Word

                if(index === 1 || index === 2 ) {
                    switch(relationtype){
                        case 1:
                        case 2:
                            return $this.comData(data) ;
                            break;
                        case 4:
                            return $this.timeData(data);
                            break;

                        case 7:
                            return $this.map2Com(data);
                            break;
                        case 8:break;

                    }
                }

                if (index === 3) {
                    switch(relationtype){
                        case 1:
                        case 2:
                            return $this.pieData(data) ;
                            break;
                        case 4:
                            return $this.pieData($this.timeData(data));
                            break;

                        case 7:
                            return $this.pieData($this.map2Com(data));
                            break;
                        case 8:break;

                    }
                }
                if(index ===4) {
                    switch(relationtype){
                        case 1:
                        case 2:
                            return $this.comData(data) ;
                            break;
                        case 4:
                            return $this.timeData(data);
                            break;

                        case 7:
                            return $this.map2Com(data);
                            break;
                        case 8:break;

                    }
                }
                if(index === 5){
                    return $this.comData(data);
                }
                if(index === 6){
                    return $this.treeData(data);
                }
                if(index === 7) {
                    return $this.fordData(data);
                }
                if(index === 8){
                    return $this.mapData(data);
                }
                if(index === 9){
                    return $this.wordData(data);
                }

            }//if(index)
        }//if(data)
    },
    'pieData': function(data){//返回数组
        console.log(data);
        var array = [];

        if(data.objects.length > 0){
            var dataobj = {};
            var i;
            var oj = data.objects;
            for(i = 0; i < oj.length; i++) {
                var dataobj = {};
                dataobj.title = data.title;
                dataobj.objects = oj[i];
                dataobj.property = (function(property) {
                    if(property.length > 1) {
                        return property[i];
                    } else {
                        return property[0];
                    }
                }(data.property));
                dataobj.relations = {};
                dataobj.relations[oj[i]] = data.relations[oj[i]];
                array.push(dataobj);
            }
        }
        if(!data) {
            array.push(dataobj);
        }

        return array;
    },
    'comLengData': function(data) {

        console.log(data);

    },
    'comData': function(data) {//data.property.length === 1 返回对象 2 返回数组
//      console.log(data);
        var i;
        var array = [],dataobj={};

        if((data.property.length === 1 && data.objects.length > 0) || (data.objects.length == 1)) {
            var i, oj = data.objects;
            //alert(1);
            dataobj.title = data.title;
            dataobj.objects = data.objects;
            dataobj.property = data.property[0];
            dataobj.relations = data.relations;
            return dataobj;
        }

        if((data.property.length > 1) || (data.property.length === 1 && data.objects.length === 1)) {
            for( i = 0; i < data.objects.length; i++) {
                dataobj = {};
                dataobj.title = data.title;
                dataobj.objects = [];
                dataobj.objects.push(data.objects[i]);
                dataobj.property = data.property[i];
                dataobj.relations = {};
                dataobj.relations[data.objects[i]] = data.relations[data.objects[i]];
                array.push(dataobj);
            }
           // console.log(array);
            return array;
        }

    },
    'timeData': function(data) {
        if(parseInt(data.relationtype) == 4) {
            var dj = {};
            dj.describe = data.describe;
            dj.title = data.title;
            dj.objects = data.objects;
            dj.relationtype = data.relationtype;
            dj.relations = {};
            dj. property = [];
            var subproperty = {};
            for( var it in data.relations) {

                var value = [];
                data.relations[it].map(function(item, index){
                    subproperty[item[0]] = item[0];
                    value.push(item[1]);
                });
                dj.relations[it] = [];
                dj.relations[it].push(value);
            }
            for( var i in subproperty){
                dj.property.push(i);
            }
            //console.log(dj);
            return dj;
        }
    },
    'treeData': function(data) {

        if(data) {
            return data.relations;
        }

    },
    'fordData': function(data) {
        var dataobj = {};
        if(data) {
            if(data.objects.length > 0) {
                var objects = {};
                dataobj.nodes = data.objects.map(function(item) {
                    objects[item] = 0;
                    return {name : item};
                });
                dataobj.edges = [];
                data.relations.map(function(item, index) {
                    var oj = item;
                    var targetlist = item.target.map(function(item, index) {
                        objects[oj.source]++;
                        objects[item]++;
                        // console.log(item);
                        return {source: data.objects.indexOf(oj.source), target: data.objects.indexOf(item)};
                    })
                    $.merge(dataobj.edges, targetlist);
                });
                dataobj.objects = objects;
               // console.log(dataobj);
            }
        }
        return dataobj;
    },
    'mapData': function(data) {
        if(parseInt(data.relationtype) == 7) {
            var dj = {};
            dj.describe = data.describe;
            dj.title = data.title;
            dj.objects = data.objects;
            dj.relationtype = data.relationtype;
            dj.relations = data.relations;
            dj. property = data.property[0];
            console.log(dj);
            return dj;
        }
    },
    'map2Com': function(data) {
        if(parseInt(data.relationtype) === 7) {
            var dj = {};
            dj.describe = data.describe;
            dj.title = data.title;
            dj.objects = data.objects;
            dj.relationtype = data.relationtype
            dj.relations = {};
            dj. property = [];
            var subproperty = {};
            for( var it in data.relations) {

                var value = [];
                data.relations[it].map(function(item, index){
                    subproperty[item[0]] = item[0];
                    value.push(item[1]);
                });
                dj.relations[it] = [];
                dj.relations[it].push(value);
            }
            for( var i in subproperty){
                dj.property.push(i);
            }
            console.log(dj);
            return dj;
        }
    },
    'wordData': function(data) {
        var arr = [];
        for(var i in data.relations){
            var o = data.relations[i];
            var a = o.map(function(item, index){
                return {name:item[0], value: item[1]};
            });
            console.log(a);
            arr = arr.concat(a);
        }
        return arr;
    }
};
function drawBasicBar(main,barData) {
    // console.log(barData);
    var series = barData.objects.map(function(item,index) {
        return {name: item, type:'bar', data:barData.relations[item][0]};
    });
    var chart = echarts.init(main);
    var option = {
        title : {
            text: barData.title,
            x:'center',
            y:'top'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            y:'top',
            data: barData.objects
        },
        toolbox: {
            show : true,
            orient:'vertical',
            x:'right',
            y:'top',
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line','stack','tiled', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : barData.property
            }
        ],
        yAxis : [
            {
                type : 'value',
                name:' ',
                nameGap:3
            }
        ],
        series :series
    };
    chart.setOption(option, true);

    return chart;
}
function drawHorizBar(main,barData) {
    // console.log(barData);
    var series = barData.objects.map(function(item,index) {
        return {name: item, type:'bar', data:barData.relations[item][0]};
    });
    var chart = echarts.init(main);
    var option = {
        title : {
            text: barData.title,
            x:'center',
            y:'top'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            y:'top',
            data: barData.objects
        },
        toolbox: {
            show : true,
            orient:'vertical',
            x:'right',
            y:'top',
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line','stack','tiled', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'value',
                name:' ',
                nameGap:3
            }
        ],
        yAxis : [
            {
                type : 'category',
                data : barData.property
            }
        ],
        series :series
    };
    chart.setOption(option, true);

    return chart;
}
function drawFord(svg,width,height,nodes,edges){
    //2.转换数据
    var force = d3.layout.force()
        .nodes(nodes)	//设定顶点数组
        .links(edges)	//设定边数组
        .size([width,height])	//设定作用范围
        .linkDistance(90)	//设定边的距离
        .charge(function(d){
            return Math.random()*(-1000);
        });	//设定顶点的电荷数

    force.start();	//开启布局计算

    //console.log(nodes);	//输出转换后的数据
    //console.log(edges);

    //3.绘制
    var color = d3.scale.category20();

    var drag = force.drag()
        .on("dragstart",function(d){
            //拖拽开始后设定被拖拽对象为固定
            d.fixed = true;
        })
        .on("dragend",function(d,i){
            //拖拽结束后变为原来的颜色
            d3.select(this).style("fill",color(i));
        })
        .on("drag",function(d){
            //拖拽中对象变为黄色
            d3.select(this).style("fill","yellow");
        });

    //绘制连线
    var lineupdate=svg.selectAll(".forceLine")
        .data(edges);
    var lineenter=lineupdate.enter().append("line")
        .attr("class","forceLine");;
    var lineexit=svg.selectAll(".forceLine")
        .data(edges)
        .exit().remove();

    //绘制节点
    var circlesupdate=svg.selectAll(".forceCircle")
        .data(nodes);
    var circlesenter=circlesupdate.enter()
        .append("circle")
        .attr("class","forceCircle")
        .attr("r",20)
        .style("fill",function(d,i){
            return color(i);
        })
        .call(force.drag);
    var circlesexit=circlesupdate.exit().remove;

    //绘制文字
    var textsupdate=svg.selectAll(".forceText")
        .data(nodes);
    var textsenter = textsupdate.enter()
        .append("text")
        .attr("class","forceText")
        .attr("x",function(d){ return d.x; })
        .attr("y",function(d){ return d.y; })
        .attr("dy", ".3em")
        .text(function(d){ return d.name; });
    var textsexit=textsupdate.exit().remove();
    //tick事件的监听器
    force.on("tick", function(){

        //更新边
        lineenter.attr("x1",function(d){ return d.source.x; });
        lineenter.attr("y1",function(d){ return d.source.y; });
        lineenter.attr("x2",function(d){ return d.target.x; });
        lineenter.attr("y2",function(d){ return d.target.y; });

        //更新顶点
        circlesenter.attr("cx",function(d){ return d.x; });
        circlesenter.attr("cy",function(d){ return d.y; });

        //更新顶点文字
        textsenter.attr("x",function(d){ return d.x; });
        textsenter.attr("y",function(d){ return d.y; });

    });


    //力学图运动开始时
    force.on("start", function(){
        console.log("运动开始");
    });

    //力学图运动结束时
    force.on("end", function(){
        console.log("运动结束");
    });
}
function drawLine (main,lineData) {
//  console.log(lineData);
    var series = lineData.objects.map(function(item,index) {
        return {name: item, type:'line', smooth: true, data:lineData.relations[item][0]};
    });
    var chart = echarts.init(main);
    var option = {
        title : {
            text: lineData.title,
            x:'center',
            y:'top'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            y:'top',
            data: lineData.objects
        },
        toolbox: {
            show : true,
            orient:'vertical',
            x:'right',
            y:'top',
            feature : {
                mark : {show: false},
                dataView : {show: true, readOnly: false},
                magicType : {show: false, type: ['line','stack','tiled', 'bar']},
                restore : {show: false},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : lineData.property
            }
        ],
        yAxis : [
            {
                type : 'value',
                name:' ',
                nameGap:3,
                scale:true,
                axisLabel : {
                    formatter: '{value}'
                }
            }
        ],
        series :series
    };
    chart.setOption(option, true);
    return chart;
}
function drawMapArea(main , areaData) {
    var min = [];
    var max = [];
    var series = areaData.objects.map(function (elem, index) {
        //alert(index,elem);
        var oj = {
            name: elem,
            type: 'map',
            mapType: 'china',
            roam: false,
            coordinateSystem: 'geo',
            label: {
                normal: {
                    areaColor: '#323c48',
                    show: true
                },
                emphasis: {
                    areaColor: '#2a333d',
                    show: true
                }
            },
            data: areaData.relations[elem].map(function (elem, index) {
                min.push(elem[1]);
                return {name: elem[0], value: elem[1]};
            })
        };
        Array.prototype.push.apply(max, min);
        return oj;
    });
    var arr = max.sort(function (a, b) {
        return a - b;
    });

    min = parseInt(arr[0]);
    max = parseInt(arr[max.length - 1]);
    console.log(max, min, series);
    var option = {
        title: {
            text: areaData.title,
            left: 'center',
            textStyle: {
                color: '#fff'
            },
        },

        backgroundColor: '#404a59',
        tooltip: {
            trigger: 'item'

        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: areaData.objects,
            textStyle: {
                color: '#fff'
            }
        },
        visualMap: {
            type: 'continuous',
            min: min,
            max: max,
            left: 'left',
            top: 'bottom',          // 文本，默认为数值文本
            calculable: true,
            color: ['#d94e5d', '#eac736', '#50a3ba'],
            textStyle: {
                color: '#fff'
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                dataView: {readOnly: false},
                restore: {}
            }
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#404a59'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: series
    };
    var chart = echarts.init(main);
    chart.setOption(option, true);
}
function drawParallel(main, paraData){
    // Schema:
    // date,AQIindex,PM2.5,PM10,CO,NO2,SO2
    var lineStyle = {
        normal: {
            width: 1,
            opacity: 0.5
        }
    };
    require('echarts');
    var series = paraData.objects.map(function(item, index){
        return 	{
            name: item,
            type: 'parallel',
            lineStyle: lineStyle,
            data: paraData.relations[item]
        };
    });
    //console.log(series);
    var schema = paraData.property.map(function(item, index) {
        return { 'name': item, 'index':index, 'text':item};
    });
    var axis = paraData.property.map(function(item, index) {
        return {dim: index, name: item};
    });
    //console.log(axis);

    var option = {
        backgroundColor: '#333',
        legend: {
            bottom: 30,
            data: paraData.objects,
            itemGap: 20,
            textStyle: {
                color: '#fff',
                fontSize: 14
            }
        },
        tooltip: {
            padding: 10,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1
        },
        // dataZoom: {
        //     show: true,
        //     orient: 'vertical',
        //     parallelAxisIndex: [0]
        // },
        parallelAxis:axis,
        visualMap: {
            show: true,
            min: 0,
            max: 150,
            dimension: 2,
            inRange: {
                color: ['#d94e5d','#eac736','#50a3ba'].reverse(),
                // colorAlpha: [0, 1]
            }
        },
        parallel: {
            left: '5%',
            right: '18%',
            bottom: 100,
            parallelAxisDefault: {
                type: 'value',
                name: '',
                nameLocation: 'end',
                nameGap: 20,
                nameTextStyle: {
                    color: '#fff',
                    fontSize: 12
                },
                axisLine: {
                    lineStyle: {
                        color: '#aaa'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#777'
                    }
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            }
        },
        series: series
    };
    var chart = echarts.init(main);
    chart.setOption(option, true);
}
function drawPie(main, pieData){

    //console.log(pieData);
    var series = pieData.relations[pieData.objects].map(function(item, index){ return {name: pieData.property[index], value: item}  });
    //console.log(series);
    var chart = echarts.init(main);
    var option = {
        title : {
            text: pieData.title,
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/> {b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            y:'top',
            data: pieData.property
        },
        toolbox: {
            show : true,
            orient:'vertical',
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie']
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        series : [
            {
                name:pieData.objects,
                type:'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:series
            }
        ]
    };
    chart.setOption(option, true);
    return chart;
}
function drawTimeline(main, timeData){
    var series = timeData.objects.map(function(item,index) {
        return {
            name: item,
            type:'line',
            smooth: true,
            symbol: 'none',
            sampling: 'average',//折线图在数据量远大于像素点时候的降采样策略
            data:timeData.relations[item][0]
        };
    });
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        title: {
            left: 'center',
            text: timeData.title,
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: timeData.property
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '50%']
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 10
        }, {
            start: 0,
            end: 10
        }],
        series: series
    };
    var myChart = echarts.init(main);
    myChart.setOption(option,true);
    return myChart;
}
function drawTree(width,height,svg,data){
    //树状图布局
    var tree = d3.layout.tree()
        .size([height, width]);

    //对角线生成器
    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var root=data;

    //给第一个节点添加初始坐标x0和x1
    root.x0 = height / 2+50;
    root.y0 = 0;

    //以第一个节点为起始节点，重绘
    redrawTree(root);

    //重绘函数
    function redrawTree(source){

        /*
         （1） 计算节点和连线的位置
         */

        //应用布局，计算节点和连线
        var nodes = tree.nodes(root);
        var links = tree.links(nodes);

        //重新计算节点的y坐标
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        /*
         （2） 节点的处理
         */

        //获取节点的update部分
        var nodeUpdate = svg.selectAll(".node")
            .data(nodes, function(d){ return d.name; });

        //获取节点的enter部分
        var nodeEnter = nodeUpdate.enter();

        //获取节点的exit部分
        var nodeExit = nodeUpdate.exit();

        //1. 节点的 Enter 部分的处理办法
        var enterNodes = nodeEnter.append("g")
            .attr("class","node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", function(d) { toggle(d); redrawTree(d); });

        enterNodes.append("circle")
            .attr("r", 0)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        enterNodes.append("text")
            .attr("x", function(d) { return d.children || d._children ? -14 : 14; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 0);


        //2. 节点的 Update 部分的处理办法
        var updateNodes = nodeUpdate.transition()
            .duration(500)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        updateNodes.select("circle")
            .attr("r", 8)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        updateNodes.select("text")
            .style("fill-opacity", 1);

        //3. 节点的 Exit 部分的处理办法
        var exitNodes = nodeExit.transition()
            .duration(500)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

        exitNodes.select("circle")
            .attr("r", 0);

        exitNodes.select("text")
            .style("fill-opacity", 0);

        /*
         （3） 连线的处理
         */

        //获取连线的update部分
        var linkUpdate = svg.selectAll(".link")
            .data(links, function(d){ return d.target.name; });

        //获取连线的enter部分
        var linkEnter = linkUpdate.enter();

        //获取连线的exit部分
        var linkExit = linkUpdate.exit();

        //1. 连线的 Enter 部分的处理办法
        linkEnter.insert("path",".node")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            })
            .transition()
            .duration(500)
            .attr("d", diagonal);

        //2. 连线的 Update 部分的处理办法
        linkUpdate.transition()
            .duration(500)
            .attr("d", diagonal);

        //3. 连线的 Exit 部分的处理办法
        linkExit.transition()
            .duration(500)
            .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();


        /*
         （4） 将当前的节点坐标保存在变量x0、y0里，以备更新时使用
         */
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

    }

    //切换开关，d 为被点击的节点
    function toggle(d){
        if(d.children){ //如果有子节点
            d._children = d.children; //将该子节点保存到 _children
            d.children = null;  //将子节点设置为null
        }else{  //如果没有子节点
            d.children = d._children; //从 _children 取回原来的子节点
            d._children = null; //将 _children 设置为 null
        }
    }
}
function drawWord(main, wordData){
    require('d3');
    require('d3.layout.cloud');
    var fill = d3.scale.category20();
    d3.layout.cloud().size([500, 500])
        .words(wordData)
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        //.font("Impact")
        .fontSize(function(d) { return d.value; })
        .on("end", draw)
        .start();

    function draw(words) {
        var svg=d3.select(main).append("svg").attr('id','svgWord')
            .attr("width", 500)
            .attr("height", 500)
            .append("g")
            .attr("transform", "translate(180,200)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            //.style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                //return "translate("+[d.x,d.y]+")";
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.name; });
    }
}