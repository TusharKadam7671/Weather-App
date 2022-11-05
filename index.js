// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={b7fa37c888c785bb1148d337aa76e53e}
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API KEY}
// https://api.openweathermap.org/data/2.5/weather?q=sangli&appid=b7fa37c888c785bb1148d337aa76e53e


//function to get data by fetch
function getData(){
    let body=document.getElementById("error");
    body.innerHTML=null;

    let maincontainer=document.getElementById("main_container");
      let daily=document.getElementById("daily");
      maincontainer.style.visibility="visible"
      daily.style.visibility="visible";

    let city=document.getElementById("query").value;

    let url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b7fa37c888c785bb1148d337aa76e53e`;

    fetch(url).then(function(res){
        // console.log(res);
        let data=res.json();
        // console.log(data);
        return data;
        //or return res.json();
    }).then(function(res){
        console.log(res)


        append(res);
        //pass all data to the append function


    }).catch(function(err){
        console.log(err);

     
       

        //when error is coming add this image to error div
        let banner=document.createElement("img");
        banner.src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/af8a6a32739675.5691dd2389a24.gif";
        banner.id="banner";

       
        let body=document.getElementById("error");
        body.append(banner)

      let maincontainer=document.getElementById("main_container");
      let daily=document.getElementById("daily");
      maincontainer.style.visibility="hidden"
      daily.style.visibility="hidden";

    })
    //.catch is not mandetory
}


//this function is for appending data
function append(data){
    

    let container=document.getElementById("container");
    container.innerHTML=null;

    let h2=document.createElement("h2");
    h2.innerText=data.name;

    let temp=document.createElement("p");
    temp.innerText=`🌡️ Temp: ${data.main.temp}`;

    let min_temp=document.createElement("p");
    min_temp.innerText=`Min Temp: ${data.main.temp_min}`;

    let max_temp=document.createElement("p");
    max_temp.innerText=`Min Temp: ${data.main.temp_max}`;

    let wind=document.createElement("p");
    wind.innerText=`🪂 Winds:- Speed:${data.wind.speed}, Deg:${data.wind.deg}`;

    let clouds=document.createElement("p");
    clouds.innerText=`☁️ Clouds: ${data.weather[0].description}`



    //sunrise - unix time conversion to normal time

    let unix_timestamp = data.sys.sunrise;

    var date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();
    
    // Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)+(" IST");
    
    console.log(formattedTime);

    let sunrise=document.createElement("p");
    sunrise.innerText=`🌅 Sunrise: ${formattedTime}`




     //sunset - unix time to normal time conversion
     let unix_timestamp2 = data.sys.sunset;

     var date2 = new Date(unix_timestamp2 * 1000);
     // Hours part from the timestamp
     var hours2 = date2.getHours();
     // Minutes part from the timestamp
     var minutes2 = "0" + date2.getMinutes();
     // Seconds part from the timestamp
     var seconds2 = "0" + date2.getSeconds();
     
     // Will display time in 10:30:23 format
     var formattedTime2 = hours2 + ':' + minutes2.substr(-2) + ':' + seconds2.substr(-2)+(" IST");
     
     console.log(formattedTime2);
 
     let sunset=document.createElement("p");

     sunset.innerText=`🌇 Sunset: ${formattedTime2}`
     
    
    //append all data to the container
    container.append(h2,temp,min_temp,max_temp,wind,clouds,sunrise,sunset);


    //map part
    let url=`https://maps.google.com/maps?q=${data.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`
    let iframe=document.getElementById("gmap_canvas");
    iframe.src=url;


    //7 days weather part

    let lat=data.coord.lat;
    let lon=data.coord.lon;
    // console.log(lat,lon)
    dailydata(lat,lon);

    //now collect data by fetching with api
    async function dailydata(lat,lon){
        try{
            
            let res=await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=b7fa37c888c785bb1148d337aa76e53e&units=metric`);
            let data=await res.json();
            console.log(data)

            appendDaily(data);

        }catch(err){
            // console.log("error");
        }
    }

    function appendDaily(data){

        let daily=document.getElementById("daily");
        daily.innerHTML=null;

        let div = document.createElement("div");
        div.id = "divbox"

        for(let i=0; i<7; i++){
            let day = document.createElement("div");
            day.setAttribute("class","day")


            let getDate=new Date(data.daily[i].dt * 1000);
            let date=(getDate.toDateString())

            let png = document.createElement("img");
            png.src = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png` 
            png.class = "png"
            console.log(data.daily[i].weather[0].icon)
           
            let max_temp = document.createElement("p");
            max_temp.innerText =  `${data.daily[i].temp.max} °C`;

            let min_temp = document.createElement("p");
            min_temp.innerText = `${data.daily[i].temp.min} °C`;

            day.append(date,png,max_temp,min_temp); 
            div.append(day);
            
        }
  
       
        daily.append(div)

        
        
    }

 

}

   
function getLocation(){
    navigator.geolocation.getCurrentPosition(success);

    function success(pos) {
        const crd = pos.coords;

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        getWeatherOnLocation(crd.latitude,crd.longitude)
      }
}

// getLocation();   -->in body Onload


function getWeatherOnLocation(lat,lon){
    let city=document.getElementById("query").value;
    let url=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=b7fa37c888c785bb1148d337aa76e53e`

    //let url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b7fa37c888c785bb1148d337aa76e53e`;

    fetch(url).then(function(res){
        // console.log(res);
        let data=res.json();
        // console.log(data);
        return data;
        //or return res.json();
    }).then(function(res){
        console.log(res)
        append(res)
    }).catch(function(err){
        console.log("get location error");
    })
}