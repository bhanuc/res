/*edit needs to be reviewed*/  
function display_map() {
    var p_id=$('#123').data('p_i');
    var m_id=$('#123').data('m_n') || $('#map_name').val();
    var url = "/project/maps/find?pid="+p_id+"&name="+m_id;
    function success_map(data){
        if(m_id && p_id ) {
          pr_data.data = data;
            main(data);
            }
        }
     $.ajax({
      type: "GET",
      url: url,
      success: success_map
      });
}
function main(data1) {
    var data=[];
     
    data=data1;
    console.log(data); 
    //data = {"nodes":[{"i_no":10000,"name": "Canteen", "info": "Bring milk" ,"childi_no":[10001,10002],"value":[1,2]}, {"i_no":10001,"name": "Gmail", "info": "Send email to Boss" ,"childi_no":[],"value":[]},{"i_no":10002,"name": "Bank", "info": "Pay Bill" ,"childi_no":[],"value":[]}]};
   
    var d3Sample = function(){
         var g = Viva.Graph.graph();
         g.Name = "Jutja project graph";
          //  console.log(data[0]);
        if(data){
         for(var i=0; i<data.length ; i++)
        {
             //  var newNode = {"i_no":data[i].i_no,"name":data[i].name, "info":data[i].info,"childi_no":data[i].childi_no};
               
            g.addNode(data[i].i_no,data[i]);
        }
            for (i = 0; i < data.length; i++){
            for(var j=0; j<data[i].childi_no.length; j++){
            //     console.log(data[i].i_no); 
              //  console.log(data[i].childi_no[j]); 
           g.addLink(data[i].i_no, data[i].childi_no[j]);
        }}}
            return g;
         };
    
     var colors = [
            "#FF0000", "#FFFF00",
            "#00FF00", "#F5A9A9"
            ];

     var example = function() {
        graph = d3Sample();
        
        var layout = Viva.Graph.Layout.forceDirected(graph, {
            springLength : 120,
            springCoeff : 0.00055,
            dragCoeff : 0.09,
            gravity : -100
        });

        var cssGraphics = Viva.Graph.View.cssGraphics();
        
        cssGraphics.node(function(node){
            var nodeUI = document.createElement('div');
            nodeUI.setAttribute('class', 'node');
            //nodeUI.title = node.data.name;
            var groupId = node.data.group;
            nodeUI.style.background = "#9edae5";
            return nodeUI;z
        });
          
        var svgGraphics = Viva.Graph.View.svgGraphics();

      var jdex=0;
      function stringDivider(str, width,arr){
        if (str.length>width) {
            var p=width;
            for (; str[p]!=' ';p--) {
          }
          if (p>0) {
            var left = str.substring(0, p);
                arr[jdex] = left;
                jdex++;
            var right = str.substring(p+1);
            stringDivider(right,width,arr);
          }
        }
        else
        {
          arr[jdex] = str;
        }
      }
    
    
         
    svgGraphics.node(function(node){
        	nodeSize = 120;

          var date = node.data.due_date;
          var index;
          if(date)
          {
              var dd = date.split("-");
              dd[0] = parseInt(dd[0]);
              dd[1] = parseInt(dd[1]);
              dd[2] = parseInt(dd[2]);
              var today = new Date();
              var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
              if(dd[2]==today.getDate() && dd[1] == today.getMonth()+1 && dd[0] == today.getFullYear())
              {
                index = 0;
              }
              else if(dd[2]==tomorrow.getDate() && dd[1] == tomorrow.getMonth()+1 && dd[0] == tomorrow.getFullYear())
              {
                index = 1;
              }
              else 
              {
                if((dd[0] >= tomorrow.getFullYear()) && ((dd[1] > tomorrow.getMonth()+1 )|| (dd[2] > tomorrow.getDate() && dd[1] == tomorrow.getMonth()+1) || (dd[0] > tomorrow.getFullYear()) ))
                {
                  index = 2;
                }
                else
                {
                  index =3;
                }
              }
          }
          else
          {
            index = node.data.i_no%4;
          }

          var arr = []; jdex=0;
          stringDivider(node.data.info,15,arr);
          if(arr.length>3)
          {
            if(arr[2].length<13)
              arr[2] = arr[2]+"...";
            else
              {
                var st = arr[2];
                st[13]=".";
                st[14]=".";
                st[12]=".";
                arr[2]=st;
              }
          }
             var svgBody = [];
           //  console.log(node.data.i_no);
              var ui = Viva.Graph.svg('g'),
             // Create SVG text element with user id as content
                  svgText = Viva.Graph.svg('text')
                    .attr('y', '20px')
                    .attr('id', node.data.i_no)
                    .attr('x','2px')
                    .attr('font-size','17px')
                    .attr('font-weight','bold')
                    .text(node.data.name);
              for(var i=0; i<arr.length && i<3; i++)
              {
                  var h = 50 + 15 *i;
                  svgBody[i] = Viva.Graph.svg('text')
                    .attr('y', h)
                    .attr('id', node.data.i_no)
                    .attr('x','0px')
                    .text(arr[i]);
              }
              var rectangle = Viva.Graph.svg("rect")
                    .attr('width', nodeSize)
                    .attr('id', node.data.i_no)
                    .attr('height', nodeSize)
                    .attr("fill", colors[index])
                    .attr('opacity',0.5);
              $(ui).dblclick(function() {
            	functions.generateModalOnDbClick(node.data);
            });

             ui.append(rectangle);
             ui.append(svgText);
              for(var i=0; i<arr.length && i<3; i++)
              {
                  ui.append(svgBody[i]);
                }
             ui.addEventListener('click', function () {
                        // toggle pinned mode
                        layout.pinNode(node, !layout.isNodePinned(node));
                    });
              return ui;
            }).placeNode(function(nodeUI, pos) {
                // 'g' element doesn't have convenient (x,y) attributes, instead
                // we have to deal with transforms: http://www.w3.org/TR/SVG/coords.html#SVGGlobalTransformAttribute
                nodeUI.attr('transform',
                            'translate(' +
                                  (pos.x - nodeSize/2) + ',' + (pos.y - nodeSize/2) +
                            ')');
            });
         
        svgGraphics.link(function(link){
            return Viva.Graph.svg('line')
                    .attr('stroke', '#999')
                    .attr('stroke-width', Math.sqrt(link.data));
        });

               var renderer = Viva.Graph.View.renderer(graph, {
            container : document.getElementById('graph1'),
            layout : layout,
            graphics : svgGraphics,
            prerender: 20,
          renderLinks : true
               });

        renderer.run();
     
           functions.pin = function(){
              graph.forEachNode(function(n){
               var node = {
                   id: n.id,
                   data: n.data
                  };
              if(pr_data.pin)
              {
                  layout.pinNode(node, true);
              }
              else
              {
                layout.pinNode(node, false);
              }
              
            });
              pr_data.pin = ! pr_data.pin;
          }
          
          $("#center").click(function(){
              var nodeId = pr_data.data[0].i_no;
              if(pr_data.data[0].parenti_no == 0)
              {
                console.log("root");
              }
              if (graph.getNode(nodeId)) {
                var pos = layout.getNodePosition(nodeId);
                renderer.moveTo(pos.x, pos.y);
              }
          });
    }();
}