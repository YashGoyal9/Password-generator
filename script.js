const inputSlider=document.querySelector("[dataLengthSlider]")
const lengthDisplay=document.querySelector("[dataLengthNumber]")
const passwordDisplay=document.querySelector("[dataPasswordDisplay]")
const copyBtn=document.querySelector("[datacopyBtn]")
const copyMsg=document.querySelector("[dataCopyMessage]")
const uppercasecheck=document.querySelector("#uppercase")
const lowercasecheck=document.querySelector("#lowercase")
const numberscheck=document.querySelector("#numbers")
const symbolscheck=document.querySelector("#symbols")
const indicator=document.querySelector("[dataIndicator]")
const generateBtn=document.querySelector(".generate-button")
const allcheckBox=document.querySelectorAll("input[type=checkbox]")

const symbols='~`!@#$%^&*()_+-={}:">?<[];,./|';

let password="";
let passwordLength = 10;
let checkcount=0;
handleSlider();
// set color to grey default 
setIndicator("#ccc");

// set passwordlength 
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize= ( (passwordLength-min )*100/(max-min) + "% 100%")
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow khud se kro
    indicator.style.boxShadow = ` 0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min)) +min ;
    // min to max a random number 
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generatelowercase(){
    return String.fromCharCode(getRndInteger(97,123)) ;
}

function generateuppercase(){
    return String.fromCharCode(getRndInteger(65,91)) ;
}

function generatesymbols(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}



function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(lowercasecheck.checked) hasLower = true;
    if(uppercasecheck.checked) hasUpper = true;
    if(numberscheck.checked) hasNumber = true;
    if(symbolscheck.checked) hasSymbol = true;

    if(hasUpper && hasLower
       && (hasNumber || hasSymbol) 
       && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}



async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied"
    }

    catch (e) {
     copyMsg.innerText = "Failed";
    }
    // to make copy wala span visible 
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000 );
}


function  handleCheckBoxChange(){
    checkcount=0;
    allcheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkcount++;
        }
    });

    // specail condition 
    if(passwordLength <checkcount ){
        passwordLength =checkcount;
        handleSlider();
    }
}


allcheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange );
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click',() =>{
    if(passwordDisplay.value)
    copyContent();
})



    // fisher yates method  

function shufflepassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
      // find out random j
      const j = Math.floor(Math.random() * (i + 1));
      // swap 2 numbers
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str = "";
    // array.forEach((el) => (str += el));
    str = array.join("");
    return str;
}



generateBtn.addEventListener('click',() =>{

    // none of the checkbox selected 
    if(checkcount == 0) return;

    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleSlider();
    }


    // lets start the journey to fing new password 

    //remove old password 
    if(password.length)
     password="";

    
    let Funcarr=[];

    if(uppercasecheck.checked){
        Funcarr.push(generateuppercase);
    }

    if(lowercasecheck.checked){
        Funcarr.push(generatelowercase);
    }

    if(numberscheck.checked){
        Funcarr.push(generateRandomNumber);
    }

    if(symbolscheck.checked){
        Funcarr.push(generatesymbols);
    }

    // compulsory addition 

    for(let i=0;i<Funcarr.length;i++){
        password+=Funcarr[i]();
    }
    console.log(password)

    // remaining addition 
    for (let i = 0; i < passwordLength - Funcarr.length; i++) {
        let randIndex = getRndInteger(0,Funcarr.length);
        console.log(randIndex)
        password += Funcarr[randIndex]();
    }



    // shuffle the password 
    password=shufflepassword(Array.from(password));

console.log(passwordDisplay.value)
    // show pass in ui 
    passwordDisplay.value = password;

    console.log(password)
    // calculate strength 
    calcStrength();
});