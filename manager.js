var page_type=0; //0 for main, 1 for restaurant data page.
var page_num=0; //0 default : number of pages.
var selected_res; //number of selected restaurant (store id)
var max_listing_perpage=5;
var max_seat_perpage=20;
var cur_max = max_listing_perpage;

//this code has been tested 2/17/2021 4:23 result-> 404 not found on fetching.

reload();

function getRestaurant(storeid,indexing) {
    fetch("http://158.108.182.7:3000/fronted/?store_id="+storeid, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    .then(response => {
        if (response.ok) {
          return response.json()
        } else if(response.status === 404) {
            cur_max = indexing;
            console.log("Store id "+indexing+" is not found.");
          return Promise.reject('error 404')
        } else {
          return Promise.reject('some other error: ' + response.status)
        }
      })
      .then((data) => {
                if (!response.ok) {
                    cur_max = indexing;
                    console.log("Store id "+indexing+" is not found.");
                }else{
                console.log("Checking..");
                console.log(data);
                if(page_type == 0){
                    //get data for listing.
                    //filter (future update)
                    if(data != null)
                        showRestaurant(indexing,data.category,data.table,data.low,data.high,data.des,data.flr)
                    else
                        cur_max = indexing+1;
                }else if(page_type == 1){
                    //get data for inform the seat info.
                    showRestaurant(indexing,data.category,data.table,data.low,data.high,data.des,data.flr)
                }
            }
        }
      );
  }
function showRestaurant(indexing,categ,table,low,high,des,flr){
    if(indexing == -1){ // create restaurant page as store data
        //show restaurant name
        
        //show category

        //show floor data

        //show description data

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

    }else{ //show list element
        //set visibility of slot to true

        //show restaurant name
        
        //show category

        //show floor data
        
        //show # of available tables
        var avai_table = avaiTable(table);

        //set color by ความแออัด
        var total = totalSeat(table);
        var avai = avaiSeat(table);
        var airPunch = avai/total;
        if(airPunch < .2){
            //change color of slot # to red
        }else if(airPunch < .5){
            //change color of slot # to yellow
        }else if(airPunch <= 1){
            //change color of slot # to green
        }
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
        if(status == false){ //if the seat is available (not occupied)
            avai_table++;
        }
    })
    return avai_table;
}

function avaiSeat(table){
    var avai_seat=0;
    table.forEach((tab) => {
        if(status == false){ //if the seat is available (not occupied)
            avai_seat += tab.number_of_seats;
        }
    })
    return avai_seat;
}

  function listRestaurant(){ //list out all restaurant
      var i;
      for(i=1;i<cur_max+1;i++){
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
        if(page_type == 0){
        //list the restaurant
            listRestaurant();
        }else if(page_type == 1){
            //get data for inform the seat info.
            getRestaurant(selected_res,-1);
        }
  }

  setInterval(() => {
    if(page_type == 0){
        //list the restaurant
        listRestaurant();
    }else if(page_type == 1){
        //get data for inform the seat info.
        getRestaurant(selected_res,-1);
    }
  },10000); //10s interval