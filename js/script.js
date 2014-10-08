var r;

function labelBarChart(r, bc, labels, attrs) {
    // Label a bar chart bc that is part of a Raphael object r
    // Labels is an array of strings. Attrs is a dictionary
    // that provides attributes such as fill (text color)
    // and font (text font, font-size, font-weight, etc) for the
    // label text.

    for (var i = 0; i<bc.bars.length; i++) {
        var bar = bc.bars[i];
        var gutter_y = bar.w * 0.4;
        var label_x = bar.x
        var label_y = bar.y + bar.h + gutter_y;
        var label_text = labels[i];
        var label_attr = { fill:  "#2f69bf", font: "16px sans-serif" };

        r.text(label_x, label_y, label_text).attr(label_attr);
    }

}

var dataProcess = function(){
//get the data from inputs
	var ordersArr = [],
		itemsArr = [],
		$inputsOrders = $('#fruits :input'),
		$inputsItems = $('#veggies :input'),
		ordersItemsNumb = $inputsOrders.length; //assuming both would always be the same
		
	$inputsOrders.each(function() { ordersArr.push($(this).val()); });
	$inputsItems.each(function() { itemsArr.push($(this).val()); });
	
	//Reset Raphael holder's HTML
	$('#holder').show().html('');
	$('#legend').show();
	
	//display the data using Raphael object
	r = Raphael("holder"),
		fin = function () {
			this.flag = r.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
		},
		fout = function () {
			this.flag.animate({opacity: 0}, 300, function () {this.remove();});
		},
		dragMove = function(dx, dy){
			//Check for bar id, and by testing for odd or even, find whether the bar is for order (odd) or for item (even)
			var barID = $(this.bar.node).prevAll(this.bar.node.nodeName).length+1; //count node types of same element type
			var pairID = Math.ceil(barID/2); //Identify which pair of order/item bars we have; sorts the issue with different element order and bar order
			if (barID%2 == 0){
				//item
				var curBarOriginInput = $('#veggies :input:eq('+(pairID-1)+')'), curVal = parseInt(curBarOriginInput.val()); //-1 because of 0 based counting
				if (curVal-dy>=0){ //don't reduce if 0
					curBarOriginInput.val(parseInt(curVal-dy));
				}
			}else{
				//order
				var curBarOriginInput = $('#fruits :input:eq('+(pairID-1)+')'), curVal = parseInt(curBarOriginInput.val()); //-1 because of 0 based counting
				if (curVal-dy>=0){ //don't reduce if 0
					curBarOriginInput.val(parseInt(curVal-dy));
				}
			}
			dataProcess();				
		},
		dragStart = function(){
			this.oy = this.attr("cy"); //get start y
			//Change cursor to drag shape
			$('#holder').css({cursor: 'n-resize'});
		},
		dragUp = function(){
			//Change cursor back to default
			$('#holder').css({cursor: 'default'});
		},
		txtattr = { font: "12px sans-serif" },
		xAxis = ["Q1","Q2","Q3","Q4"];
		
	r.clear();
	r.text(150, 20, "Chart diagram graph").attr(txtattr);    
	r.barchart(20, 50, 300, 220, [ordersArr, itemsArr], {colors:["#ff6f00","#800080"]}).hover(fin, fout).drag(dragMove, dragStart, dragUp);		
	var axisX = Raphael.g.axis(60,270,290,null,null,4,2,xAxis, " ", 0, r); //horizontal
	axisX.text.attr(txtattr);

            
}
$('#chartData').on("submit", function(e)  {
			
	//Prevent submission, just chart data
	e.preventDefault();
	
	dataProcess();

	return false;
});