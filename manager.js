var page_type=0; //0 for main, 1 for restaurant data page.
var page_num=0; //0 default : number of pages.
var selected_res; //number of selected restaurant (store id)
var max_listing_perpage=5;
var max_seat_perpage=20;
var cur_max = max_listing_perpage;

//this code has been tested 2/18/2021 0:03 result-> success.

reload();

function getRestaurant(storeid,indexing) {
    fetch("http://158.108.182.7:3001/frontend?store_id="+storeid, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    .then(response => {
        if (response.ok) {
          return response.json()
        } else if(response.status === 404) {
            cur_max = indexing;
            console.log("[1] Store id "+indexing+" is not found.");
          return Promise.reject('error 404')
        } else {
          return Promise.reject('some other error: ' + response.status)
        }
      })
      .then((datas) => {
                console.log(">> requested store id "+storeid)
                var data = datas["result"][0];

                if(page_type == 0){
                    //get data for listing.
                    //filter (future update)
                    if(data != undefined)
                        showRestaurant(indexing,data.name,data.category,data.table,data.lowest_price,data.highest_price,data.description,data.floor)
                    else{
                        console.log("[no data] the store_id "+indexing+" is not found. Now max index is "+indexing);
                        cur_max = indexing;
                    }
                }else if(page_type == 1){
                    //get data for inform the seat info.
                    showRestaurant(indexing,data.name,data.category,data.table,data.lowest_price,data.highest_price,data.description,data.floor)
                }
            }
      );
  }
function showRestaurant(indexing,naMe,categ,table,low,high,des,flr){
    if(indexing == -1){ // create restaurant page as store data
        //show restaurant name
        console.log("Restaurant name is "+naMe);
        //show category
        console.log("  -category: "+categ);
        //show floor data
        console.log("  -floor "+flr);
        //show description data
        console.log("  -descrtiption : "+des);
        //show table data
        var i=0;
        var base_i=page_num*max_seat_perpage;
        table.forEach((tab) => {
            //do change to seat {base_i+i}
            //set table id
            //set table color via status
            //set table max seats
            i++;
        })
        //show low-high data
        console.log("  -price range "+low+"-"+high);

    }else{ //show list element
        //set visibility of slot to true

        //show restaurant name
        console.log("Restaurant name is "+naMe);
        //show category
        console.log("  -category: "+categ);
        //show floor data
        console.log("  -floor "+flr);
        //show # of available tables
        var avai_table = avaiTable(table);
        console.log("  -num of available table "+avai_table);
        //set color by ความแออัด
        var total = totalSeat(table);
        var avai = avaiSeat(table);
        var airPunch = avai*100/total;
        var color="";
        if(airPunch < 20){
            //change color of slot # to red
            color = "red";
        }else if(airPunch < 50){
            //change color of slot # to yellow
            color = "yellow";
        }else if(airPunch <= 100){
            //change color of slot # to green
            color = "green";
        }
        console.log("  -airPunch level : "+airPunch+" appear in "+color);
    }
}
function totalSeat(table){ //return number of available table
    var total_seat=0;
    table.forEach((tab) => {
        total_seat += tab.number_of_seats;
    })
    return total_seat;
}

function avaiTable(table){
    var avai_table=0;
    table.forEach((tab) => {
        if(tab.status == true){ //if the seat is available
            avai_table++;
        }
    })
    return avai_table;
}

function avaiSeat(table){
    var avai_seat=0;
    table.forEach((tab) => {
        if(tab.status == true){ //if the seat is available
            avai_seat += tab.number_of_seats;
        }
    })
    return avai_seat;
}

  function listRestaurant(){ //list out all restaurant
      var i;
      for(i=1;i<cur_max;i++){
          var lastStore = (page_num*max_listing_perpage)+i;
          getRestaurant(lastStore,i);
      }
  }

  function selectRestaurant(num){  //on click -> do select restaurant index num
        selected_res = page_num*max_listing_perpage+num;
        page_num =0;
        page_type=1;
        //change html page to restaurant page
  }
  function backToList(){ //on lick -> back to main list menu
        page_num =0;
        page_type=0;
        cur_max = max_listing_perpage;
        reload();
        //change html page to index page
  }

  function reload(){
      //reset the page element to default (turn of listing visiblity and wait for next update)
      //initial main
      console.log("RELOAD");
      cur_max =max_listing_perpage;
        if(page_type == 0){
        //list the restaurant
            listRestaurant();
        }else if(page_type == 1){
            //get data for inform the seat info.
            getRestaurant(selected_res,-1);
        }
  }

  setInterval(() => {
      console.log("------ fetching new data -----");
    if(page_type == 0){
        //list the restaurant
        listRestaurant();
    }else if(page_type == 1){
        //get data for inform the seat info.
        getRestaurant(selected_res,-1);
    }
  },10000); //10s interval
