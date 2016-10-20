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
        circle = document.getElementById(option.svgId).querySelectorAll("circle"),
        d = Date.now();

  for (var i = 0; i < circle.length; i++ ){
      if (isTargeted(circle[i]) || i == circle.length-1) continue;




      if( (i+1) % option.width == 0 || (i+1) >= option.width*(option.height - 1)){

          if ((i+1) % option.width == 0 ){
              str += "<line x1='"+ parseFloat(circle[i].attributes.cx.value)+"' " +
                  "y1='" +parseFloat(circle[i].attributes.cy.value)+ "'";
              circle[i].target = true;
              str += generateVertical();
          } else {
              if(isTargeted(circle[i+1])){
                  console.log("target next element");
                  continue;
              }
              str += "<line x1='"+ parseFloat(circle[i].attributes.cx.value)+"' " +
                  "y1='" +parseFloat(circle[i].attributes.cy.value)+ "'";
              circle[i].target = true;
              str += generateHorizontal();
          }
      } else {
          str += "<line x1='"+ parseFloat(circle[i].attributes.cx.value)+"' " +
              "y1='" +parseFloat(circle[i].attributes.cy.value)+ "'";
          circle[i].target = true;
          if (choiceDirect()){
              //vertical
              //проверяем предпоследний ряд на правильность генерирования, мы не можем генерировать линию вниз,
              // если внизу нечетное количество незаполненых элементов
              if (i > (option.width*(option.height-2)-1) && i < (option.width*(option.height-1) -1) ){
                  if (chekDirect(i, circle)){
                      str += generateVertical();
                  } else{
                      str += generateHorizontal();
                  }
              //    console.log("предпоследний ряд");
              } else {
                  str += generateVertical();
              }

          } else {
              //horizontal
              if (circle[i+1].target == true){
                  str += generateVertical();
              } else {
                  str += generateHorizontal();
              }
          }
      }

  }
    console.log((Date.now()- d));
    document.getElementById(option.svgId).innerHTML += str;
/*    for (i = 0; i < circle.length; i++){
        if (!circle[i].target){
            console.log("new call");
            clearLine();
            generateLine(option);
        }
    }*/
    console.log((Date.now()- d));
    function generateVertical(){
        circle[i+option.width].target = true;
        return "x2='"+ parseFloat(circle[i+option.width].attributes.cx.value)+"' " +
            "y2='"+ parseFloat(circle[i+option.width].attributes.cy.value)+"' />";
    }
    function generateHorizontal(){
        circle[i+1].target = true;
        return "x2='"+ parseFloat(circle[i+1].attributes.cx.value)+"' " +
            "y2='"+ parseFloat(circle[i+1].attributes.cy.value)+"' />";
    }

};
function choiceDirect(){
    //return 1 = vertical, 0 = horizontal;
    return Math.round (Math.random());
};
function isTargeted(elem){
    return elem.target;
}
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
function chekDirect(i, circle){
    var count = 0,
        downElemIndex = i+option.width-1;
    while(!circle[downElemIndex].target || count > option.width){
        count++;
        downElemIndex--;
    }

    return count % 2 === 0 ? true : false;
}

var option = {
    width: 60,
    height: 10,
    parentContainer: document.getElementById("field"),
    svgId: "lalala"
};
document.getElementById("clear").addEventListener("click", clearLine);
document.getElementById("generate").addEventListener("click", function(){generateLine(option)});
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