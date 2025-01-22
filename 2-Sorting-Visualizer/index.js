let arraySize = null;
let numbers = [];
let maxHeight = null;
let barWidth = null;
const container = document.getElementById("histogramContainer");


const sortingFunctions = {
    bubble: bubbleSort,
    merge: mergeSort,
    quick: quickSort,
    selection: selectionSort,
    insertion: insertionSort,
};



document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission to avoid page reload

    // to have random array size
    // arraySize = document.getElementById('arraySize').value; // Update global variable

    // to get random array 
    // Generate an array of ArraySize random numbers between 1 and 450
    // numbers = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 400) + 1);

    // numbers = document.getElementById('arrayInput').value.split(",");
    numbers = document.getElementById('arrayInput').value.split(",").map(Number);
    console.log(numbers);

    // Find the maximum value in the array to scale the heights
    maxHeight = Math.max(...numbers);

    // Calculate the width of each bar based on the number of elements in the array
    barWidth = 100 / numbers.length + "%";

    document.getElementById("performanceTimer").innerHTML = "00 sec";

    // call function to render histogram
    renderHistogram(numbers);

    console.log("no errors");
});



function renderHistogram(numbers){

    // Clear the container (if it already has content)
    container.innerHTML = "";

    // Create bars based on the array of numbers
    numbers.forEach(num => {
     // Create a new div element for each bar
     const bar = document.createElement("div");
     bar.classList.add("bar");

     // Set the width of the bar dynamically
     bar.style.width = barWidth;

     // Scale the height based on the value, relative to the maximum value
     bar.style.height = (num / maxHeight) * 100 + "%";

     // add numbers to innerhtml of bar  -??

     // Append the bar to the container
     container.appendChild(bar);
    });
}


document.getElementById('startButton').addEventListener("click", async ()=>{
    const sortingAlgorithm = document.getElementById("sortingAlgorithm").value;
    const t1 = performance.now();
    await sortingFunctions[sortingAlgorithm](numbers);
    const t2 = performance.now();
    const perform  = (t2-t1)/1000; // converts to sec
    document.getElementById("performanceTimer").innerHTML = perform+" sec";
});


async function swapBars(index1, index2) {
    const bars = container.children;

    // Highlight bars to swap
    bars[index1].style.backgroundColor = "yellow";
    bars[index2].style.backgroundColor = "yellow";

    await delay(50); // Add delay for visualization

    // Swap the heights
    const tempHeight = bars[index1].style.height;
    bars[index1].style.height = bars[index2].style.height;
    bars[index2].style.height = tempHeight;

    // Revert to default color
    bars[index1].style.backgroundColor = "#007bff";
    bars[index2].style.backgroundColor = "#007bff";
}

function swap(arr, index1, index2) {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}


function highlightBars(index1, index2) {
    const bars = container.children;
    bars[index1].style.backgroundColor = "red";
    bars[index2].style.backgroundColor = "red";
}

function unhighlightBars(index1, index2) {
    const bars = container.children;
    bars[index1].style.backgroundColor = "#007bff"; // Default color
    bars[index2].style.backgroundColor = "#007bff"; // Default color
}


function highlightBar(index) {
    const bars = container.children;
    bars[index].style.backgroundColor = "red";
}
function unhighlightBar(index) {
    const bars = container.children;
    bars[index].style.backgroundColor = "#007bff";
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function selectionSort(numbers) {
    for (let i = 0; i < numbers.length; i++) {
        let miniEle = i;
        for (let j = i + 1; j < numbers.length; j++) {
            // Highlight the bars being compared
            highlightBars(i, j);
            await delay(50); // Add delay for visualization

            if (numbers[j] < numbers[miniEle]) {
                miniEle = j;
            }

            // Unhighlight the bars
            unhighlightBars(i, j);
        }

        if (miniEle !== i) {
            // Swap elements and visualize the swap
            swap(numbers, i, miniEle);
            await swapBars(i, miniEle);
        }

        // Update the histogram after each step
        renderHistogram(numbers);
    }
}


async function bubbleSort(numbers){
    for(let i=numbers.length-1;i>0;i--){
        for(let j=0;j<i;j++){
            highlightBars(i, j);
            await delay(50);
            if(numbers[j]>numbers[j+1]){
                swap(numbers, j, j+1);
                await swapBars(j, j+1);
            }
            unhighlightBars(i, j);
        }
        renderHistogram(numbers);
    }
}


async function insertionSort(numbers){
    for(let i=0;i<numbers.length;i++){
        let j=i;
        highlightBars(i, j);
        await delay(50);
        while(j>0 && numbers[j-1] > numbers[j]){
            swap(numbers, j-1, j);
            await swapBars(j-1, j);
            j--;
        }
        unhighlightBars(i, j);
        renderHistogram(numbers);
    }
}



async function merge(low,mid,high,numbers) {
    let temp = [];
    let left = low;
    let right = mid+1;
    while(left<=mid && right<=high){
        if(numbers[left]<=numbers[right]){
            temp.push(numbers[left]);
            left++;
        }
        else{
            temp.push(numbers[right]);
            right++;
        }
    }
    while(left<=mid){
        temp.push(numbers[left]);
        left++;
    }
    while(right<=high){
        temp.push(numbers[right]);
        right++;
    }
    for(let i=0;i<temp.length;i++){
        numbers[i+low] = temp[i];

        highlightBar(i+low);
        await delay(50);
        unhighlightBar(i+low);
        renderHistogram(numbers);
    }
}
async function mergeHelper(low,high,numbers) {
    if(low >= high){
        return;
    }
    let mid = Math.floor((low+high)/2);
    await mergeHelper(low,mid,numbers);
    await mergeHelper(mid+1,high,numbers);
    await merge(low,mid,high,numbers);
}
async function mergeSort(numbers){
    let low = 0;
    let high = numbers.length-1;
    await mergeHelper(low,high,numbers);
}


async function corrector(low,high,numbers){
    let pivot = numbers[low];
    let i=low;
    let j=high;
    while(i<j){
        highlightBars(i, j);
        await delay(50);
        while(numbers[i]<=pivot && i<high){
            i++
        }
        while(numbers[j] > pivot && j > low){
            j--;
        }
        if(i<j){
            swap(numbers,i,j);
            await swapBars(i,j);
        }
        unhighlightBars(i, j);
        renderHistogram(numbers);
    }
    swap(numbers,low,j);
    await swapBars(low,j);
    renderHistogram(numbers);
    return j;
}
async function quickHelper(low,high,numbers) {
    if(low<high){
        let partition = await corrector(low,high,numbers);
        await quickHelper(low,partition-1,numbers);
        await quickHelper(partition+1,high,numbers);
    }
}
async function quickSort(numbers){
    let pivot = 0;
    let low = 0;
    let high = numbers.length-1;
    await quickHelper(low,high,numbers);
}

