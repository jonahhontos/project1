$('body').on("mouseover",".menu-item",function(){
  $(this).toggleClass("menu-item-hover")
  // console.log("mouseover on " + this)
})

$('body').on("mouseout",".menu-item",function(){
  $(this).toggleClass("menu-item-hover")
  // console.log("mouseout on " + this)
})
