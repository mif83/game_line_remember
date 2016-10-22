/**
 * Created by dima on 17.10.2016.
 */
function createField(option){
    console.log(option);
    var option = option || {},
        w = option.width || 10,
        h = option.height || 6,
        parent = option.parentContainer || document.body,
        svgId = option.svgId || "lalala",
        str = "",
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.setAttribute("id", svgId);
    svg.style.width = option.width*30 + "px";
    svg.style.height = option.height*30 + "px";

    for(var i = 0, y = 10; i < h; i++, y+=30){
        for(var j = 0, x = 10; j < w; j++, x+=30){
            str += "<circle cx='" + x + "' cy='" + y + "'></circle>";
        }

    }
    svg.innerHTML = str;
    parent.appendChild(svg);

};
function generateLine(option){
    var str = '',
       // circle = document.getElementById(option.svgId).querySelectorAll("circle"),
        d = Date.now(),
        length = option.width*option.height,
        arrPointTargeted = [];


  for (var i = 0; i < length; i++ ){
      var obj ={};
      if (arrPointTargeted[i] || i == length-1) continue;

      if( (i+1) % option.width == 0 || (i+1) >= option.width*(option.height - 1)){

          if ((i+1) % option.width == 0 ){
              obj.iStart = i;
              arrPointTargeted[i] = true;
              obj.iEnd = generateVertical();
          } else {
              if(arrPointTargeted[i+1]){
                  console.log("target next element");
                  continue;
              }
              obj.iStart = i;
              arrPointTargeted[i] = true;
              obj.iEnd = generateHorizontal();
          }
      } else {
          obj.iStart = i;
          arrPointTargeted[i] = true;
          if (choiceDirect()){
              //vertical
              //проверяем предпоследний ряд на правильность генерирования, мы не можем генерировать линию вниз,
              // если внизу нечетное количество незаполненых элементов
              if (i > (option.width*(option.height-2)-1) && i < (option.width*(option.height-1) -1) ){
                  if (chekDirect(i, arrPointTargeted)){
                      obj.iEnd = generateVertical();
                  } else{
                      obj.iEnd = generateHorizontal();
                  }
              //    console.log("предпоследний ряд");
              } else {
                  obj.iEnd = generateVertical();
              }

          } else {
              //horizontal
              if ( arrPointTargeted[i+1] == true){
                  obj.iEnd = generateVertical();
              } else {
                  obj.iEnd = generateHorizontal();
              }
          }
      }
      arrLines.push(obj);
  }
  //  console.log((Date.now()- d));
  //  document.getElementById(option.svgId).innerHTML += str;
  for (i = 0; i < length; i++){
        if (!arrPointTargeted[i]){
            console.log("new call");
            arrPointTargeted.length = 0;
            arrLines.length = 0;
            generateLine(option);
        }
    }
    console.log((Date.now()- d));

    function generateVertical(){
        arrPointTargeted[i+option.width] = true;
        return i+option.width;
    }

    function generateHorizontal(){
        arrPointTargeted[i+1] = true;
        return ++i;
    }
    console.log(JSON.stringify(arrLines));
    return arrLines;
};
function choiceDirect(){
    //return 1 = vertical, 0 = horizontal;
    return Math.round (Math.random());
};
/*function isTargeted(elem){
    return elem.target;
}*/
function clearLine(){
    var p = document.getElementById(option.svgId),
        lines = p.querySelectorAll("line");
    for (var i = 0; i < lines.length; i++){
        p.removeChild(lines[i]);
    }

}
function clearField(){
    option.parentContainer.innerHTML ="";
}
function chekDirect(i, arrPointTargeted){
    var count = 0,
        downElemIndex = i+option.width-1;
    while(!arrPointTargeted[downElemIndex] || count > option.width){
        count++;
        downElemIndex--;
    }

    return count % 2 === 0 ? true : false;
}
function showLines(arrLines){
    var str = "",
        circle = document.getElementById(option.svgId).querySelectorAll("circle");
    for (var i = 0; i < circle.length; i++){
        str += "<line x1='"+ parseFloat(circle[arrLines[i].iStart].attributes.cx.value)+"' " +
            "y1='" +parseFloat(circle[arrLines[i].iStart].attributes.cy.value)+ "'" +
             "x2='"+ parseFloat(circle[arrLines[i].iEnd].attributes.cx.value)+"' " +
            "y2='"+ parseFloat([arrLines[i].iEnd].attributes.cy.value)+"' />";
    }
    document.getElementById(option.svgId).innerHTML += str;
}

var option = {
    width: 10,
    height: 5,
    parentContainer: document.getElementById("field"),
    svgId: "lalala"
},
    arrLines = [];
document.getElementById("clear").addEventListener("click", clearLine);
document.getElementById("generate").addEventListener("click", function(){
    generateLine(option);
    showLines(arrLines);
});
/*document.getElementById("rows").addEventListener("change", function(e){
    option.height = e.target.value;
    clearField();
    createField(option);
});
document.getElementById("cols").addEventListener("change", function(e){
    option.width = e.target.value;
    clearField();
    createField(option);
});*/

createField(option);