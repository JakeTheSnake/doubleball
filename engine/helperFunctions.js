GameCreator.helperFunctions.determineQuadrant = function(base, obj)
{
	var x = obj.x;
	var y = obj.y;
	var width = obj.width;
	var height = obj.height;
	var baseWidth = base.width;
	var baseHeight = base.height;
	var objMidX = x + width / 2;
	var objMidY = y + height / 2;
	var baseMidX = base.x + base.width / 2;
	var baseMidY = base.y + base.height / 2;
	var baseEdgeTL = {x: base.x, y: base.y};
	var baseEdgeTR = {x: base.x + baseWidth, y: base.y};
	var baseEdgeBL = {x: base.x + baseHeight, y: base.y};
	var baseEdgeBR = {x: base.x + baseHeight, y: base.y + baseHeight};
	
	//Top left quadrant
	if(objMidX - baseMidX <= 0 && objMidY - baseMidY <= 0)
	{
		if(objMidX - baseEdgeTL.x > objMidY - baseEdgeTL.y)
		{	
			return 1;
		}
		else
		{
			return 4;
		}
	}
	//Top right quadrant
	else if(objMidX - baseMidX >= 0 && objMidY - baseMidY <= 0)
	{
		if(objMidX - baseEdgeTR.x < baseEdgeTR.y - objMidY)
		{
			return 1;
		}
		else
		{
			return 2;
		}
	}
	//Bottom right quadrant
	else if(objMidX - baseMidX >= 0 && objMidY - baseMidY >= 0)
	{
		if(objMidX - baseEdgeBR.x < objMidY - baseEdgeBR.y)
		{
			return 3;
		}
		else
		{
			return 2;
		}
	}
	//Bottom left quadrant
	else if(objMidX - baseMidX <= 0 && objMidY - baseMidY >= 0)
	{
		if(baseEdgeBL.x - objMidX < objMidY - baseEdgeBL.y)
		{
			return 3;
		}
		else
		{
			return 4;
		}
	}
}