var functions={};
var forms={};
forms.displayMessage = '';

functions.editingprojectdetails = function(){
    $("#projedit").bPopup();
}

functions.generateModalOnDbClick = function(node) {
    $("#f").bPopup();
    var head = document.getElementById("h1Fr");
    head.innerHTML=node.name;   
    var body = document.getElementById("h2Fr");
    if(node.due_date){
    body.innerHTML = node.info + "<br>" + node.due_date;
    } else {
        body.innerHTML = node.info + "<br>" + "Due Date is not Set";
    }

    var cancel = document.getElementById("cl");
    cancel.onclick = function(){
     $("#f").bPopup().close();
    }
    var create = document.getElementById("cr");
    create.onclick = function(){
        $("#f").bPopup().close();
         functions.create(node);
    }
    var edit = document.getElementById("ed");
    edit.onclick = function(){
        $("#f").bPopup().close();
        functions.edit(node);
    }
    var del_node = document.getElementById("del");
    del_node.onclick = function(){
        $("#f").bPopup().close();
        functions.del(node);
    }
    var hide = document.getElementById("hide");
    hide.onclick = function(){
        $("#f").bPopup().close();
        functions.hide(node);
        $("#error").bPopup();
    }

};

functions.create= function(node){
    console.log("creating");
 //   if(!key) { return; }     
  //  console.log("i");
    $("#form").unbind('submit');

    // Triggering bPopup when click event is fired
    $("#form").bPopup();
    
    $("#form").submit(function(event) {

    /* stop form from submitting normally */
    event.preventDefault();

    /* get some values from elements on the page: */
        
        function success(data){
                    console.log(data);
                    pr_data.data = data ;
                    $("#form").bPopup().close();
                    var i = data[(data).length-1];
                    var newNode = {"i_no":i.i_no,"name":i.name, "info":i.info,"childi_no":[],"due_date":i.due_date ,"parenti_no":i.parenti_no};
                    graph.addNode(data[(data).length-1].i_no,newNode);
                  graph.addLink(node.i_no,data[(data).length-1].i_no);
        }
    var date = document.getElementById("dateForm").value;
    console.log(date);

    var url = "/project/maps/addnode";
    var map_name = $('#123').data('m_n') ;
    if(map_name === "undefined") { map_name = $('#map_name').val() } ;
    var url_data = { name: $('#name').val(), info: $('#info').val(),project_id:$('#123').data('p_i'),parenti_no: node.i_no,map_name: map_name, due_date: date };
       
        $.ajax({
            type: "POST",
            url: url,
            data: url_data,
            success: success
        });
    });
}

functions.edit = function(node){
    console.log("editing");
//    if(!key) { return; }     
//    console.log("j");
    $("#form").unbind('submit');
    // Triggering bPopup when click event is fired
    $("#form").bPopup();
    $("#form").submit(function(event) {

    /* stop form from submitting normally */
    event.preventDefault();

    /* get some values from elements on the page: */
        
        function success(data){
                    console.log(data);
                    pr_data.data = data;
                    $("#form").bPopup().close();
                    for(var i=0;i<(data).length;i++)
                    {
                        if(data[i].i_no == node.i_no)
                            break;
                    }
                    var newNode = {"i_no":data[i].i_no,"name":data[i].name, "info":data[i].info,"childi_no":data[i].childi_no,"parenti_no":data[i].parenti_no,"due_date":data[i].due_date};
                    graph.removeNode(node.i_no,node);
                    graph.forEachLinkedNode(node.i_no, function(linkedNode, link){
                        graph.removeLink(link);
                    });
             
                    graph.addNode(data[i].i_no,newNode);			
                    if(data[i].parenti_no!=0)
                    {
                        graph.addLink(data[i].parenti_no,data[i].i_no);
                    }
                    for(var j=0;j<data[i].childi_no.length;j++)
                    {
                        graph.addLink(data[i].i_no,data[i].childi_no[j]);
                    }
        }
   var date = document.getElementById("dateForm").value;
        console.log(date);
    var url = "/project/maps/editnode";
    var map_name = $('#123').data('m_n') ;
    if(map_name === "undefined") { map_name = $('#map_name').val() } ;
    var url_data = { name: $('#name').val(), info: $('#info').val(),project_id:$('#123').data('p_i'),i_no:node.i_no,map_name: map_name,due_date: date};
       
        $.ajax({
            type: "POST",
            url: url,
            data: url_data,
            success: success
        });
    });
}
functions.del =function(node){
//    if(!key) { return; }     
//    console.log("k");
    console.log("delting");
    $("#d").unbind('submit');
    $("#d").bPopup();
    $("#d").submit(function(event) {
        
        event.preventDefault();
        function success(data){
            pr_data.data= JSON.parse(data);
            console.log(pr_data.data);
        }
        for(i=0;i<pr_data.data.length;i++)
        {
            if(pr_data.data[i].i_no == node.i_no)
            {   
                break;
            }
        }
        functions.deleteChild(pr_data.data[i]);
        var ino = pr_data.data[i].parenti_no;
        if(ino != 0)
        {
            for(var j=0; j<pr_data.data.length;j++)                 // j is the index of the parent of the "node"
            {
                if(pr_data.data[j].i_no== ino)
                {
                    break;
                }
            }
            for(var k=0; k<pr_data.data[j].childi_no.length;k++)
            {
                if(pr_data.data[j].childi_no[k] == node.i_no)
                {
                    break;
                }
            }
        }
        graph.removeNode(pr_data.data[i].i_no,pr_data.data[i]);
        pr_data.data.splice(i,1);
        if(ino != 0)
        {
            pr_data.data[j].childi_no.splice(k,1);
        }
        $("#d").bPopup().close();
        var url = "/project/maps/delete";
        var map_name = $('#123').data('m_n') ;
        if(map_name === "undefined") { map_name = $('#map_name').val() } ;
        var url_data = { map_name: map_name,project_id:$('#123').data('p_i'),data:pr_data.data };
        $("#form").bPopup().close();
        $.ajax({
            type: "POST",
            url: url,
            data: url_data,
            success: success    
             });  
    });
 }
 functions.deleteChild = function(node){
            var i;
            
            for(i=0;i<node.childi_no.length;i++)
            {
                var j=0;
                while(pr_data.data[j].i_no!=node.childi_no[i])
                {
                    j++;
                }
                functions.deleteChild(pr_data.data[j]);

                    graph.forEachLinkedNode(node.childi_no[i], function(linkedNode, link){
                    graph.removeLink(link);
                    });
                    graph.removeNode(node.childi_no[i],pr_data.data[j]);
                    pr_data.data.splice(j,1);
            }
         }
functions.cr_project = function() {                     //this is used to create first node of a map

   console.log("creating map");
    
    $("#create_map").unbind('submit');

    // Triggering bPopup when click event is fired
    $("#create_map").bPopup();
    $("#create_map").submit(function(event) {

    /* stop form from submitting normally */
    event.preventDefault();

    /* get some values from elements on the page: */
        
        function success(data){
        console.log(data);
        pr_data.data = data;

        var length = Object.keys(data).length;

        $("#create_map").bPopup().close();
        var newNode = {"i_no":data[length-1].i_no,"name":data[length-1].name, "info":data[length-1].info,"childi_no":[], "due_date":data[length-1].due_date,"parenti_no":data[length-1].parenti_no};
        graph.addNode(data[length-1].i_no,newNode);
        }
    var date = document.getElementById("dateCreate").value;
    console.log(date);
    var url = "/project/maps/create";
    var url_data = { name: $('#cr_name').val(), info: $('#cr_message').val(),project_id:$('#123').data('p_i'),parenti_no:0,map_name: $('#map_name').val(), due_date: date }
       
        $.ajax({
            type: "POST",
            url: url,
            data: url_data,
            success: success
            });

    });
};

functions.hide = function(node) {
    console.log("hiding ..........................");
//    if(!key) { return; }     
//    console.log(key);
    var i;
    var temp = [];
     for(i=0;i<pr_data.data.length;i++)
     {
        if(pr_data.data[i].i_no == node.i_no)
            break;
     }

    functions.hideChild(pr_data.data[i],i,temp);
    for(var j=0; j<temp.length;j=j+2)
    {
        graph.addLink(temp[j],temp[j+1]);
    }
    if(pr_data.data[i].visibility == undefined || pr_data.data[i].visibility == 0)
        pr_data.data[i].visibility = 1 ;
    else
        pr_data.data[i].visibility = 0 ;
}

functions.hideChild = function(){
            var i;
            var index = arguments[1];
            var node = arguments[0];
            for(i=0;i<node.childi_no.length;i++)
            {
                var j=0;
                while(pr_data.data[j].i_no!=node.childi_no[i])
                {
                    j++;
                }
                functions.hideChild(pr_data.data[j],index,arguments[2]);

                if(pr_data.data[index].visibility == 0 || pr_data.data[index].visibility == undefined )
                {
                    console.log("Hide");
                    graph.forEachLinkedNode(node.childi_no[i], function(linkedNode, link){
                    graph.removeLink(link);
                    });
                    graph.removeNode(node.childi_no[i],pr_data.data[j]);
                }
                else
                {
                    console.log("unhide");
                    graph.addNode(node.childi_no[i],pr_data.data[j]);
                    arguments[2].push(pr_data.data[j].parenti_no);
                    arguments[2].push(pr_data.data[j].i_no);
                }
            }
         }
functions.stringDivider = function(str, width,arr,jdex){
        if (str.length>width) {
            var p=width;
            for (;p>=0 && str[p]!=' ';p--) {
          }
          if (p>0) {
            var left = str.substring(0, p);
                arr[jdex] = left;
                jdex++;
            var right = str.substring(p+1);
            functions.stringDivider(right,width,arr,jdex);
          }
          else if(p<0){                                                 //if length of word is more than width
            var left = str.substring(0, width-1);
            var trim = left.replace(/^\s+|\s+$/g, '');
              left = trim.concat("-");
            arr[jdex] = left;
                jdex++;
            var right = str.substring(width);
            functions.stringDivider(right,width,arr,jdex);
          }
        }
        else
        {
          arr[jdex] = str;
        }
      }
functions.wrapString = function(arr,width){
    if(arr[2])
    {
        if(arr[2].length<12)
        {
            var trim = arr[2].replace(/^\s+|\s+$/g, '');
              arr[2] = trim.concat(" ...");
        }
        else
        {
            var p = arr[2].length;
            var str = arr[2];
            for (; str[p]!=' ';p--) {
          }
            if(p>0)
            {
                var left = str.substring(0, p);
                var trim = left.replace(/^\s+|\s+$/g, '');
                    arr[2] = trim.concat(" ...");
            }
            else
            {
                arr[2]= " ...";
            }
        }
    }
}
functions.findColor =  function(date,id){
    var colors = [
            "#FF0000", "#FFFF00",
            "#00FF00", "#F5A9A9"
            ];
            if(date)
            {
              var dd = date.split("/");         //day/mm/yyyy
              dd[0] = parseInt(dd[0]);          //dd[2] = date
              dd[1] = parseInt(dd[1]);          //dd[1] = month
              dd[2] = parseInt(dd[2]);          //dd[0] = year
              var today = new Date();
              var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
              if(dd[0]==today.getDate() && dd[1] == today.getMonth()+1 && dd[2] == today.getFullYear())
              {
                index = 0;
              }
              else if(dd[0]==tomorrow.getDate() && dd[1] == tomorrow.getMonth()+1 && dd[2] == tomorrow.getFullYear())
              {
                index = 1;
              }
              else 
              {
                if((dd[2] >= tomorrow.getFullYear()) && ((dd[1] > tomorrow.getMonth()+1 )|| (dd[0] > tomorrow.getDate() && dd[1] == tomorrow.getMonth()+1) || (dd[2] > tomorrow.getFullYear()) ))
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
            index = id%4;
          }1
          return (colors[index]);
} 
functions.wrapHead = function(arr,width){       
   if(arr[0])
   {
    if(arr[0].length<9)
        {
            var trim = arr[0].replace(/^\s+|\s+$/g, '');
              arr[0] = trim.concat(" ...");
        }
    else
    {
        if(arr[0].indexOf(' ') >= 0)
        {
            var p = arr[0].length;
            var str = arr[0];
            for (; str[p]!=' ';p--) {
            }
            if(p>0)
            {
                var left = str.substring(0, p);
                var trim = left.replace(/^\s+|\s+$/g, '');
                    arr[0] = trim.concat(" ...");
            }
        }
        else
        {
            var left = arr[0].substring(0, 9);
            arr[0] = trim.concat("...");
        }
    }
  } 
}
