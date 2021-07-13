define("post-playhouse-calendar-renderer/components/edit-form",["exports","@ember-decorators/object","post-playhouse-calendar-renderer/utils/showings-data-converters"],function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()
var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=function(e,t,r,n){var a,i=arguments.length,u=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n
if("object"===("undefined"==typeof Reflect?"undefined":o(Reflect))&&"function"==typeof Reflect.decorate)u=Reflect.decorate(e,t,r,n)
else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(u=(i<3?a(u):i>3?a(t,r,u):a(t,r))||u)
return i>3&&u&&Object.defineProperty(t,r,u),u},i=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,Ember.Component.extend({})),n(t,[{key:"readableDates",get:function(){return(0,r.fullCodeStringToReadable)(this.showingsData.datesUrl)}}]),t}()
e.default=i,a([(0,t.computed)("showingsData")],i.prototype,"readableDates",null)}),define("post-playhouse-calendar-renderer/components/maybe-squish",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var t=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,Ember.Component.extend({})),t}()
e.default=t}),define("post-playhouse-calendar-renderer/components/p-calendar",["exports","@ember-decorators/component","@ember-decorators/object","luxon"],function(e,t,r,n){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()
var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},i=function(e,t,r,n){var o,i=arguments.length,u=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n
if("object"===("undefined"==typeof Reflect?"undefined":a(Reflect))&&"function"==typeof Reflect.decorate)u=Reflect.decorate(e,t,r,n)
else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(u=(i<3?o(u):i>3?o(t,r,u):o(t,r))||u)
return i>3&&u&&Object.defineProperty(t,r,u),u}
function u(e){var t=void 0
return(t="number"==typeof e?n.DateTime.fromMillis(e):"string"==typeof e?n.DateTime.fromISO(e):e).minus({days:t.weekday%7})}var s=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,Ember.Component),o(t,[{key:"longTitles",get:function(){return this.showingsData.titles.full}},{key:"weeksData",get:function(){var e=this.showingsData.calendar.getDates(),t=n.DateTime.fromISO(e[0].date).weekday%7,r=6-n.DateTime.fromISO(e[e.length-1].date).weekday%7
return e.reduce(function(e,t){var r=u(t.date),n=e[e.length-1],o=n[n.length-1]
return o?(u(o.date).hasSame(r,"day")?n.push(t):e.push([t]),e):(n.push(t),e)},[[]]).map(function(e,n,o){return{frontPadding:0===n?t:void 0,backPadding:n===o.length-1?r:void 0,showsByDay:e.map(function(e){return e.showings.map(function(e){return{id:e.productionId,time:function(e){switch(e){case 10:return"10a"
case 14:return"2p"
case 20:return"8p"
default:throw new Error("Not enough known times to translate hour: "+e)}}(e.dateTime.hour),title:e.title.short}})}),startingDate:0===n?e[0].date:u(e[0].date).toISODate()}})}}]),t}()
i([(0,r.computed)("showingsData")],s.prototype,"longTitles",null),i([(0,r.computed)("showingsData")],s.prototype,"weeksData",null),s=i([(0,t.tagName)("")],s),e.default=s}),define("post-playhouse-calendar-renderer/components/show-counts",["exports","@ember-decorators/object","@ember-decorators/component"],function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()
var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=function(e,t,r,n){var a,i=arguments.length,u=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n
if("object"===("undefined"==typeof Reflect?"undefined":o(Reflect))&&"function"==typeof Reflect.decorate)u=Reflect.decorate(e,t,r,n)
else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(u=(i<3?a(u):i>3?a(t,r,u):a(t,r))||u)
return i>3&&u&&Object.defineProperty(t,r,u),u},i=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,Ember.Component),n(t,[{key:"init",value:function(){(function e(t,r,n){null===t&&(t=Function.prototype)
var o=Object.getOwnPropertyDescriptor(t,r)
if(void 0===o){var a=Object.getPrototypeOf(t)
return null===a?void 0:e(a,r,n)}if("value"in o)return o.value
var i=o.get
return void 0!==i?i.call(n):void 0})(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"init",this).call(this)}},{key:"titles",get:function(){return this.showingsData.titles.short}},{key:"allShowings",get:function(){return this.showingsData.agendasPerShow.map(function(e){return e.reduce(function(e,t){return e+t.performances.length},0)})}},{key:"afternoonShowings",get:function(){return this.showingsData.agendasPerShow.map(function(e){return e.reduce(function(e,t){return e+t.performances.filter(function(e){return"2pm"===e.timeString}).length},0)})}},{key:"morningShowings",get:function(){return this.showingsData.agendasPerShow.map(function(e){return e.reduce(function(e,t){return e+t.performances.filter(function(e){return"10am"===e.timeString}).length},0)})}},{key:"eveningShowings",get:function(){return this.showingsData.agendasPerShow.map(function(e){return e.reduce(function(e,t){return e+t.performances.filter(function(e){return"8pm"===e.timeString}).length},0)})}}]),t}()
a([(0,t.computed)("showingsData")],i.prototype,"titles",null),a([(0,t.computed)("showingsData")],i.prototype,"allShowings",null),a([(0,t.computed)("showingsData")],i.prototype,"afternoonShowings",null),a([(0,t.computed)("showingsData")],i.prototype,"morningShowings",null),a([(0,t.computed)("showingsData")],i.prototype,"eveningShowings",null),i=a([(0,r.tagName)("")],i),e.default=i}),define("post-playhouse-calendar-renderer/components/showing-list",["exports","@ember-decorators/object","post-playhouse-calendar-renderer/utils/showings-data-converters"],function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var n=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()
var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},a=function(e,t,r,n){var a,i=arguments.length,u=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n
if("object"===("undefined"==typeof Reflect?"undefined":o(Reflect))&&"function"==typeof Reflect.decorate)u=Reflect.decorate(e,t,r,n)
else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(u=(i<3?a(u):i>3?a(t,r,u):a(t,r))||u)
return i>3&&u&&Object.defineProperty(t,r,u),u},i=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,Ember.Component.extend({})),n(t,[{key:"init",value:function(){(function e(t,r,n){null===t&&(t=Function.prototype)
var o=Object.getOwnPropertyDescriptor(t,r)
if(void 0===o){var a=Object.getPrototypeOf(t)
return null===a?void 0:e(a,r,n)}if("value"in o)return o.value
var i=o.get
return void 0!==i?i.call(n):void 0})(t.prototype.__proto__||Object.getPrototypeOf(t.prototype),"init",this).call(this)}},{key:"showAndDates",get:function(){var e=this.showingsData,t=e.titles,n=e.datesUrl,o=(0,r.fullCodeStringToPublishable)(n).map(function(e){return e.split("\n").map(function(e){return"  "+e}).join("\n")})
return t.full.map(function(e,t){return{title:e,showDateList:o[t]}})}},{key:"datedShowings",get:function(){var e=this.showingsData,t=e.titles,n=e.datesUrl,o=(0,r.urlDataToShowingsAgenda)(t.full.join(","),n)
return o.forEach(function(e){return e.performances.forEach(function(e){return e.timeString=function(e,t,r){var n,o,a=t-e.length
return a>0&&(n=a,o=function(){return e=r(" ",e)},Array.from(new Array(n)).map(o)),e}(e.timeString,4,u)})}),o}},{key:"showings",get:function(){return this.showingsData.calendar.getDates().map(function(e){return e.showings}).reduce(function(e,t){return e.concat(t)},[]).reduce(function(e,t){var r=e[t.productionId-1]
return r?r.showings.push(t):e[t.productionId-1]={title:t.title.full,showings:[t]},e},[]).map(function(e){return{title:e.title,months:e.showings.map(function(e){return e.dateTime}).reduce(function(e,t){var r=e[e.length-1],n=t.monthLong
return r&&r.month===n||(r={month:n,weekendShowings:[],weekdayShowings:[]},e.push(r)),t.weekday>4?r.weekendShowings.push(t):r.weekdayShowings.push(t),e},[])}})}}]),t}()
function u(e,t){return t+e}e.default=i,a([(0,t.computed)("showingsData")],i.prototype,"showAndDates",null),a([(0,t.computed)("showingsData")],i.prototype,"datedShowings",null),a([(0,t.computed)("showingsData")],i.prototype,"showings",null)}),define("post-playhouse-calendar-renderer/controllers/index",["exports","@ember-decorators/service","@ember-decorators/object","luxon","post-playhouse-calendar-renderer/utils/showings-data-converters"],function(e,t,r,n,o){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0
var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()
var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u=function(e,t,r,n){var o,a=arguments.length,u=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n
if("object"===("undefined"==typeof Reflect?"undefined":i(Reflect))&&"function"==typeof Reflect.decorate)u=Reflect.decorate(e,t,r,n)
else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(u=(a<3?o(u):a>3?o(t,r,u):o(t,r))||u)
return a>3&&u&&Object.defineProperty(t,r,u),u},s="Yankees,Gilligan,Sound,Ladies,Rotten",c="Damn Yankees,Gilligan‘s Island,The Sound of Music,Church Basement Ladies,Something Rotten",l="2022-05-27[1]A3B3C2E30g3o3s2C30g3i3m3q2u3w2A2D30d3j3m3[2]0c3d3e2h3n3q3v3B30f3i2m2o3p1v3A3D20b3f3g2l2[3]0j3k3l2p3r3u30e3h3i1p2s3w1x2C2E20e2i3m2[4]0x3y3z20b2f2j2n3t2w3C3D10c3e3f1j2l3[5]00a3b3c2h2l3o2p3t3v2z3B30c2f2k3n2",f=function(e){function t(){(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")})(this,t)
var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))
return e.shortTitles=s,e.longTitles=c,e.dates=l,e.editing=!1,e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,Ember.Controller.extend({queryParams:{shortTitles:{replace:true},longTitles:{replace:true},dates:{replace:true},editing:{replace:true}}})),a(t,[{key:"_changeTitle",value:function(e,t,r){var n=r+"Titles",o=Ember.get(this,n).split(",").concat([])
o[e]=t,this.set(n,o.join(","))}},{key:"_shiftDates",value:function(e,t){var r=Object.assign({},(0,o.urlToShorthand)(this.dates)),a=r.startingDate,i={}
i[e]=t
var u=n.DateTime.fromISO(a).plus(i).toFormat("yyyy-MM-dd")
r.startingDate=u,this.set("dates",(0,o.shorthandToUrl)(r))}},{key:"changeLongTitle",value:function(e,t){t.preventDefault(),this._changeTitle(e,t.target.value,"long")}},{key:"changeShortTitle",value:function(e,t){t.preventDefault(),this._changeTitle(e,t.target.value,"short")}},{key:"changeReadableDates",value:function(e,t){var r=t.target.value,n=(0,o.fullCodeStringToReadable)(this.dates).concat([])
n[e]=r,this.set("dates",(0,o.readablesToUrl)(n))}},{key:"shiftDays",value:function(e,t){t.preventDefault(),this._shiftDates("days",e)}},{key:"addShow",value:function(e){e.preventDefault(),this.set("shortTitles",this.shortTitles+","),this.set("longTitles",this.longTitles+","),this.set("dates",this.dates+"["+this.showingsData.titles.full.length+"]")}},{key:"removeShow",value:function(e,t){t.preventDefault()
var r=this.shortTitles.split(","),n=this.longTitles.split(",")
r.splice(e,1),n.splice(e,1),this.set("shortTitles",r.join(",")),this.set("longTitles",n.join(","))
var o=-1
this.set("dates",this.dates.replace(/\[\d*\][^&\[]*/g,function(t){return++o===e?"":t}))}},{key:"showingsData",get:function(){var e=this.getProperties(["dates","longTitles","shortTitles"]),t=e.dates,r=e.longTitles,n=e.shortTitles
return new o.ShowingsData(n,r,t)}},{key:"url",get:function(){if(this.get("fastboot").isFastBoot)return""
var e=document.location.search+document.location.hash
return document.location.origin+document.location.pathname+(e=e.replace(/%5B|%5D|%20|%2C|%27/g,function(e){switch(e){case"%5B":return"["
case"%5D":return"]"
case"%20":return"+"
case"%2C":return","
case"%27":return"'"
default:return e}}))}}]),t}()
e.default=f,u([(0,t.service)("fastboot")],f.prototype,"fastboot",void 0),u([(0,r.computed)("dates","longTitles","shortTitles")],f.prototype,"showingsData",null),u([(0,r.computed)("dates","longTitles","shortTitles")],f.prototype,"url",null),u([r.action],f.prototype,"changeLongTitle",null),u([r.action],f.prototype,"changeShortTitle",null),u([r.action],f.prototype,"changeReadableDates",null),u([r.action],f.prototype,"shiftDays",null),u([r.action],f.prototype,"addShow",null),u([r.action],f.prototype,"removeShow",null)}),define("post-playhouse-calendar-renderer/helpers/fallback",["exports"],function(e){"use strict"
function t(e){var t=!0,r=!1,n=void 0
try{for(var o,a=e[Symbol.iterator]();!(t=(o=a.next()).done);t=!0){var i=o.value
if(null!=i)return i}}catch(e){r=!0,n=e}finally{try{!t&&a.return&&a.return()}finally{if(r)throw n}}return null}Object.defineProperty(e,"__esModule",{value:!0}),e.fallback=t,e.default=Ember.Helper.helper(t)}),define("post-playhouse-calendar-renderer/initializers/ajax",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0})
var t=Ember.get,r=function(e){var r=t(this,"fastboot.request.protocol")
if(/^\/\//.test(e.url))e.url=r+e.url
else if(!/^https?:\/\//.test(e.url))try{e.url=r+"//"+t(this,"fastboot.request.host")+e.url}catch(e){throw new Error("You are using Ember Data with no host defined in your adapter. This will attempt to use the host of the FastBoot request, which is not configured for the current host of this request. Please set the hostWhitelist property for in your environment.js. FastBoot Error: "+e.message)}if(!najax)throw new Error("najax does not seem to be defined in your app. Did you override it via `addOrOverrideSandboxGlobals` in the fastboot server?")
najax(e)}
e.default={name:"ajax-service",initialize:function(e){e.register("ajax:node",r,{instantiate:!1}),e.inject("adapter","_ajaxRequest","ajax:node"),e.inject("adapter","fastboot","service:fastboot")}}}),define("post-playhouse-calendar-renderer/initializers/error-handler",["exports"],function(e){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"error-handler",initialize:function(e){Ember.onerror||(Ember.onerror=function(e){var t="There was an error running your app in fastboot. More info about the error: \n "+(e.stack||e)
Ember.Logger.error(t)})}}}),define("post-playhouse-calendar-renderer/utils/showings-data-converters",["exports","luxon","@ember-decorators/object"],function(e,t,r){"use strict"
Object.defineProperty(e,"__esModule",{value:!0}),e.ShowingsData=e.Showing=e.ShowData=void 0,e.shorthandToUrl=function(e){var r=e.startingDate,n=e.showData,o=t.DateTime.fromISO(r).startOf("day"),a=n.reduce(function(e,t,r){var n=o.plus({days:r}),a=n.year-o.year,i=Math.abs(n.month-o.month)+12*a,u=t.m,s=t.a,c=t.e,l=[]
return u&&u.forEach(function(e){return l[e]="m"}),s&&s.forEach(function(e){return l[e]=l[e]?l[e]+"a":"a"}),c&&c.forEach(function(e){return l[e]=l[e]?l[e]+"e":"e"}),l.forEach(function(t,r){for(e[r]||(e[r]="");O(e[r],i);)e[r]+="0"
e[r]+=S(n.day)+R(t)}),e},[]).reduce(function(e,t,r){return e+"["+r+"]"+t},"")
return""+r+a},e._idTokenToShowingToken=j,e.fullCodeStringToReadable=_,e.fullCodeStringToPublishable=k,e._dateCodeStringToTokens=P,e._urlCodeParts=x,e._urlToShorthandPerShow=C,e.urlToShorthand=function(e){var t=x(e).startingDateString,r=C(e).reduce(function(e,t){for(var r=Math.max(e.length,t.length),n=function(r){e[r]=e[r]||{},Object.keys(t[r]||{}).forEach(function(n){var o=e[r][n]||[]
e[r][n]=o.concat(t[r][n]||[])})},o=0;o<r;o++)n(o)
return e},[])
return{startingDate:t,showData:r}},e.readablesToUrl=function(e){var r=function(e){var r=t.DateTime.local().plus({years:5})
return e.forEach(function(e){var n=(e.match(/\s*(\d{4}|[A-z]+|\d{1,2}[mae]{1,3}),?\s*/g)||[]).map(function(e){return e.replace(/,/g,"").trim()}),o=t.DateTime.local().startOf("year"),a=!1
n.forEach(function(e){if(!a)if(/\d{1,2}[mae]{1,3}/.test(e))a=!0,(o=o.set({day:parseInt(e)}))<r&&(r=o)
else if(/\d{4}/.test(e)){var n=t.DateTime.fromISO(e+"-01-01")
o=n}else{var i=v.indexOf(e.toLowerCase())+1,u=o.set({month:i})
u<o&&(u=u.plus({years:1})),o=u}})}),r}(e),o=e.map(function(e,o){var a=r,i=r,u="["+(o+1)+"]",s=(e.match(/\s*(\d{4}|[A-z]+|\d{1,2}[mae]{1,3}),?\s*/g)||[]).map(function(e){return e.replace(/,/g,"").trim()})
return s.forEach(function(e){if(/\d{1,2}[mae]{1,3}/.test(e))u+=function(e){var t=e.match(b)||[],r=n(t,2),o=r[0],a=r[1]
return""+S(o)+R(a)}(e),a=a.set({day:parseInt(e)}),i=a
else if(/\d{4}/.test(e)){var r=t.DateTime.fromISO(e+"-01-01")
r>a&&(a=r)}else{var o=v.indexOf(e.toLowerCase())+1,s=a.set({month:o})
if(s<a&&(s=s.plus({years:1})),a=s,i){var c=function(e,t){var r=t.year-e.year,n=t.month-e.month
return 12*r+n}(i,s)
Array.from(new Array(c)).forEach(function(){return u+="0"})}}}),u})
return r.toFormat("yyyy-MM-dd")+o.join("")},e._urlDataToShowingsLists=L,e.urlDataToShowingsAgenda=function(e,r){return L(e,r).map(function(e){return r=e.dates,o=e.title,r.split("\n").map(function(e){var r=e.match(/^\w+ /)[0].trim(),a=e.match(/\d{1,2}\S?/g)
return a.map(function(e){var a=e.match(/(\d{1,2})(.?)/),i=n(a,3),u=(i[0],i[1]),s=i[2],c="*"===s?"2pm":"‡"===s?"10am":"8pm"
return{dateString:r+" "+u,inaccurateDate:t.DateTime.fromFormat(r+" "+u+", 2000","LLLL d, yyyy"),performances:[{timeString:c,title:o}]}})}).reduce(function(e,t){return e.concat(t)}).reduce(A,[])
var r,o}).reduce(function(e,t){return e.concat(t)}).reduce(A,[]).sort(F).map(U).map(function(e){var t=e.dateString,r=e.performances
return{dateString:t,performances:r}})}
var n=function(){return function(e,t){if(Array.isArray(e))return e
if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,o=!1,a=void 0
try{for(var i,u=e[Symbol.iterator]();!(n=(i=u.next()).done)&&(r.push(i.value),!t||r.length!==t);n=!0);}catch(e){o=!0,a=e}finally{try{!n&&u.return&&u.return()}finally{if(o)throw a}}return r}(e,t)
throw new TypeError("Invalid attempt to destructure non-iterable instance")}}()
function o(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t]
return r}return Array.from(e)}var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r]
n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}()
function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s=function(e,t,r,n){var o,a=arguments.length,i=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n
if("object"===("undefined"==typeof Reflect?"undefined":u(Reflect))&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,t,r,n)
else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(i=(a<3?o(i):a>3?o(t,r,i):o(t,r))||i)
return a>3&&i&&Object.defineProperty(t,r,i),i},c=(e.ShowData=function e(t,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{}
i(this,e),this.id=t,this.time=r,this.title=n[t]||"NO TITLE"},{});["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E"].forEach(function(e,t){c[e]=t+1,c[t+1]=e})
var l=function(e){return c[e]},f=e.Showing=function(){function e(t){i(this,e),this.dateTime=t.exactTime,this.monthDayCode=l(this.dateTime.day),this.title=t.idLookup(t.productionId),this.weekend=this.dateTime.weekday>4,this.productionId=+t.productionId}return a(e,[{key:"weekday",get:function(){return!this.weekend}}]),e}(),p=function(e){return e.toISODate()},h=function(e){e.sort(function(e,t){return e.dateTime.toMillis()>t.dateTime.toMillis()?1:e.dateTime.toMillis()===t.dateTime.toMillis()?0:-1})},d=function(e){return"string"==typeof e?t.DateTime.fromISO(e):e},y=function(){function e(){i(this,e),this.dates={}}return a(e,[{key:"addEvent",value:function(e){var t=this.getWritableDate(e.dateTime)
t.push(e),h(t)}},{key:"getShowingsForDate",value:function(e){return[].concat(o(this.getWritableDate(d(e))))}},{key:"getWritableDate",value:function(e){var t=p(e)
return this.dates[t]?this.dates[t]:this.dates[t]=[]}},{key:"getDates",value:function(){var e=this
return this.cleanDates(),Object.keys(this.dates).map(function(t){return{date:t,showings:e.getShowingsForDate(t)}}).sortBy("date")}},{key:"cleanDates",value:function(){this.trimDates(),this.addMissingDates()}},{key:"addMissingDates",value:function(){var e=this
m(Object.keys(this.dates)).forEach(function(t){return e.dates[t]=[]})}},{key:"trimDates",value:function(){var e=Object.keys(this.dates).sort()
if(0!==e.length){for(var t=0;t<e.length;t++){var r=e[t]
0===this.getShowingsForDate(r).length&&delete this.dates[r]}for(var n=e.length-1;n>=0;n--){var o=e[n]
0===this.getShowingsForDate(o).length&&delete this.dates[o]}}}}]),e}()
function m(e){var r=e.sort()
if(!r.length)return[]
var n=t.DateTime.fromISO(r.slice(0,1)[0]),o=t.DateTime.fromISO(r.slice(-1)[0])
if(n.toISODate()===o.toISODate())return[]
for(var a=o.diff(n,"days").days,i=[];a>0;)i.unshift(n.plus({days:a}).toISODate()),--a
return i.filter(function(e){return!r.includes(e)})}var g=/\d{1,2}[mae]{1,3}/,b=/(\d{1,2}|[mae]{1,3})/g,v=["january","february","march","april","may","june","july","august","september","october","november","december"]
function w(e){return"abcdefghijklmnopqrstuvwxyzABCDE".indexOf(e)+1}function S(e){return"abcdefghijklmnopqrstuvwxyzABCDE"[(e="string"==typeof e?parseInt(e,10):e)-1]}function O(e,t){if(void 0===e)throw new Error("no value given for comparing to months")
return(e.match(/0/g)||[]).length<t}function D(e){return v.includes(e.toLowerCase())}function j(e){var t=n(e,2),r=t[0],o=t[1]
return""+w(r)+E(o)}var T=e.ShowingsData=function(e){function r(e,t,n){i(this,r)
var o=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(r.__proto__||Object.getPrototypeOf(r)).call(this))
return o.shortTitlesUrl=e,o.fullTitlesUrl=t,o.datesUrl=n,o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t)
e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(r,Ember.Object),a(r,[{key:"titles",get:function(){return{short:this.shortTitlesUrl.split(","),full:this.fullTitlesUrl.split(",")}},set:function(e){this.set("shortTitlesUrl",e.short.join(",")),this.set("fullTitlesUrl",e.full.join(","))}},{key:"agendaForAllShows",get:function(){return M(this.agendasPerShow.reduce(function(e,t){return e.concat(t)}))}},{key:"agendaForAllShowsWithDarkDays",get:function(){return e=M(this.agendasPerShow.reduce(function(e,t){return e.concat(t)})),r=m(e.map(function(e){return t.DateTime.fromMillis(e.timestamp).toISODate()})),e.concat(r.map(function(e){var r=t.DateTime.fromISO(e)
return{timestamp:r.toMillis(),dateString:r.toFormat("LLLL d"),performances:[]}})).sortBy("timestamp")
var e,r}},{key:"agendasPerShow",get:function(){return this.dataConversion}},{key:"calendar",get:function(){return this.dataConversion,this._calendar}},{key:"dataConversion",get:function(){var e=this
this._calendar=new y
var r,o=x(this.datesUrl),a=o.startingDateString,i=o.showsDates,u=t.DateTime.fromISO(a),s=(r=function(t){return{full:e.titles.full[+t-1],short:e.titles.short[+t-1]}},function(e){return new f(Object.assign({},e,{idLookup:r}))})
return i.map(function(t,r){var o=u.startOf("month")
return P(t).reduce(function(t,a){if("0"===a)return o=o.plus({months:1}),t
var i=function(e){var t=n(e,2),r=t[0],o=t[1],a=w(r),i=E(o),u=[]
return Array.from(i).forEach(function(e){switch(e){case"m":u.push({timeString:"10am",hourOfDay:10})
break
case"a":u.push({timeString:"2pm",hourOfDay:14})
break
case"e":u.push({timeString:"8pm",hourOfDay:20})}}),{dayOfMonth:a,showings:u}}(a),u=i.dayOfMonth,c=i.showings,l=o.plus({days:u-1})
return c.forEach(function(t){e._calendar.addEvent(s({productionId:r+1,exactTime:l.plus({hours:t.hourOfDay})}))}),t.concat([{timestamp:l.toMillis(),dateString:l.toFormat("LLLL d"),performances:c.map(function(t){return Object.assign({},t,{shortTitle:e.titles.short[r],fullTitle:e.titles.full[r]})})}])},[])})}}]),r}()
function _(e){var r=x(e),n=r.startingDateString,o=r.showsDates,a=t.DateTime.fromISO(n),i=a.toFormat("yyyy")
return o.map(function(e){var t=i,r=a.startOf("month")
return P(e).map(function(e){return"0"===e?(r=r.plus({months:1})).toFormat("LLLL"):j(e)}).reduce(function(e,t,r,n){0===r&&I(t)&&e.push(a.toFormat("LLLL"))
var o=e[e.length-1]
return D(t)&&o&&D(o)?(e[e.length-1]=t,e):(e.push(t),e)},[]).forEach(function(e){return D(e)?t+="\n"+e:I(e)?t+=" "+e+",":void 0}),t})}function k(e){return _(e).map(function(e){return e.replace(/\d{4}\s+/g,"").replace(/(\d{1,2})([mae]{1,3})/g,function(e,t,r){var n={m:1,a:2,e:3},o=t,a=r.split("")
return a.sort(function(e,t){return n[e]-n[t]}),a.map(function(e){return""+o+e}).join(", ")}).replace(/(\d{1,2})([mae])/g,function(e,t,r){return""+t+{m:"‡",a:"*",e:""}[r]}).replace(/,$/gm,"")})}function P(e){return e.match(/(0|.{2})/g)||[]}function E(e){switch(e){case"1":return"m"
case"2":return"a"
case"3":return"e"
case"4":return"ma"
case"5":return"me"
case"6":return"ae"
case"7":return"mae"
default:throw new Error("unknown slotId of "+e)}}function x(e){var t,r=e.split(/\[\d*\]/g),n=(t=r,Array.isArray(t)?t:Array.from(t))
return{startingDateString:n[0],showsDates:n.slice(1)}}function C(e){var r=x(e),o=r.startingDateString
return r.showsDates.map(function(e,r){var a=r+1,i=[],u=t.DateTime.fromISO(o),s=0
P(e).forEach(function(e){if("0"!==e){var t=e.split(""),r=n(t,2),o=r[0],c=r[1],l=w(o)-1,f=u.startOf("month").plus({months:s,days:l}).diff(u,"days").toObject().days||0
i[f]=function(e,t){var r=E(e),n={}
return Array.from(r).forEach(function(e){return n[e]=[t]}),n}(c,a)}else s++})
for(var c=[],l=0;l<i.length;l++)c[l]=Object.assign({},i[l]||{})
return c})}function R(e){switch(e){case"m":return 1
case"a":return 2
case"e":return 3
case"ma":return 4
case"me":return 5
case"ae":return 6
case"mae":return 7
default:throw new Error("unrecognized grouping: "+e)}}function I(e){return g.test(e)}function L(e,t){var r=e.split(","),n=k(t)
return r.map(function(e,t){return{title:e,dates:n[t]}})}function A(e,t){for(var r=0;r<e.length;r++){var n=e[r]
if(n.dateString===t.dateString)return n.performances=n.performances.concat(t.performances),e}return e.push(t),e}function M(e){for(var t=[],r={},n=0;n<e.length;n++){var a,i=e[n],u=r[i.timestamp]
if(u)(a=u.performances).push.apply(a,o(i.performances))
else t.push(i),r[i.timestamp]=i}return t.sortBy("timestamp")}function F(e,t){var r=e.inaccurateDate.diff(t.inaccurateDate).as("seconds")
return r<0?-1:0===r?0:1}function U(e){return e.performances.sort(function(e,t){var r=parseInt(e.timeString,10)
r=10===r?1:r
var n=parseInt(t.timeString,10)
return r-(n=10===n?1:n)}),e}s([(0,r.computed)("shortTitlesUrl","fullTitlesUrl")],T.prototype,"titles",null),s([(0,r.computed)("agendasPerShow")],T.prototype,"agendaForAllShows",null),s([(0,r.computed)("agendaForAllShows")],T.prototype,"agendaForAllShowsWithDarkDays",null),s([(0,r.computed)("dataConversion")],T.prototype,"agendasPerShow",null),s([(0,r.computed)("dataConversion")],T.prototype,"calendar",null),s([(0,r.computed)("shortTitlesUrl","fullTitlesUrl","datesUrl")],T.prototype,"dataConversion",null)})
