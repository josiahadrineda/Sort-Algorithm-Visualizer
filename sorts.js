//Setup
let canvas = document.getElementById("canvas");
let cx = canvas.getContext("2d");

//Init Array Size and Sort Speed
let cntText = document.getElementById("sizeText");
let cntSlider = document.getElementById("size");
let cnt = cntSlider.value;

let speedSlider = document.getElementById("speed");
let speed = speedSlider.value;

//Init Operations
let operationsText = document.getElementById("operationsText");
let operations = 0;
operationsText.innerHTML += operations;

//Init Array
let arr = [];
function init(cnt) {
    let arr = []
    let height = canvas.height / cnt;
    let yDis = canvas.height / cnt - 0.05;
    for (let i = 0; i < cnt; i++) {
        arr.push(~~height);
        height += yDis;
    }
    return arr;
}

arr = init(cnt);

//Shuffle (https://stackoverflow.com/questions/5836833/create-an-array-with-random-values)
function shuffle(arr)   {
    operations = -1;

    let temp, curr, top = arr.length;
    if (top) while (--top)  {
        curr = Math.floor(Math.random() * (top+1));
        temp = arr[curr];
        arr[curr] = arr[top];
        arr[top] = temp;
    }
    return arr;
}

arr = shuffle(arr);

//Highlight Elements Before Swapping
function highlight(color, arr, el1, el2)    {
    operations++;
    operationsText.innerHTML = "Operations: "+ operations;

    cx.clearRect(0, 0, canvas.width, canvas.height);

    let spacing = canvas.width;
    for (i = 0; i < cnt; i++) spacing /= 2;
    let width = canvas.width / cnt * 0.5;
    let xDis = canvas.width / cnt;
    for (let j = 0; j < arr.length; j++) {
        cx.fillStyle = color;
        if (arr[j] == el1) {
            cx.fillRect(spacing, 0, width, el1);
        } else if (arr[j] == el2)   {
            cx.fillRect(spacing, 0, width, el2)
        } else  {
            cx.fillStyle = "blue";
            cx.fillRect(spacing, 0, width, arr[j]);
        }
        spacing += xDis;
    }
}

//Display Array
function display(color, arr)    {
    if (color !== "green")  {
        operations++;
        operationsText.innerHTML = "Operations: "+ operations;
    }

    cx.clearRect(0, 0, canvas.width, canvas.height);
    cx.fillStyle = color;

    let spacing = canvas.width;
    for (let i=0; i < cnt; i++) spacing /= 2;
    let width = canvas.width / cnt * 0.5;
    let xDis = canvas.width / cnt;
    for (let j = 0; j < arr.length; j++) {
        cx.fillRect(spacing, 0, width, arr[j]);
        spacing += xDis;
    }
}

display("blue", arr);

//Delay (https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)
function sleep(ms)  {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Adjust Array Size and Sort Speed
cntSlider.oninput = function()   {
    cnt = cntSlider.value;
    arr = init(cnt);
    arr = shuffle(arr);
    display("blue", arr);
}

speedSlider.oninput = function()    {
    speed = speedSlider.value;
}

//Shuffle Button Functionality
let shuffleButton = document.getElementById("shuffle");
shuffleButton.addEventListener("click", function ()  {
    arr = shuffle(arr);
    display("blue", arr);
});

//Sorts
async function selectionSort(arr)    {
    cntSlider.style.visibility = "hidden";
    shuffleButton.disabled = true;

    for (let i = 0; i < arr.length; i++)    {
        minInd = arr.slice(i).indexOf(Math.min(...arr.slice(i)))+i;
        let curr = arr[minInd];
        arr[minInd] = arr[i];
        arr[i] = curr;

        highlight("red", arr, arr[i], arr[minInd]);
        await sleep(speed);

        operations += arr.length;
    }

    display("green", arr);

    cntSlider.style.visibility = "visible";
    shuffleButton.disabled = false;
}

async function bubbleSort(arr)  {
    cntSlider.style.visibility = "hidden";
    shuffleButton.disabled = true;

    for (let i = 0; i < arr.length; i++)    {
        for (let j = 1; j < arr.length-i; j++)  {
            highlight("red", arr, arr[j], arr[j-1]);

            if (arr[j] < arr[j-1]) {
                let curr = arr[j];
                arr[j] = arr[j-1];
                arr[j-1] = curr;
            }

            await sleep(speed);
            display("blue", arr);
        }
    }

    display("green", arr);

    cntSlider.style.visibility = "visible";
    shuffleButton.disabled = false;
}

async function insertionSort(arr)  {
    cntSlider.style.visibility = "hidden";
    shuffleButton.disabled = true;

    for (let i = 1; i < arr.length; i++)    {
        let j = i-1;
        let curr = arr[i];
        while (j >= 0 && curr < arr[j]) {
            highlight("red", arr, curr, arr[j]);
            await sleep(speed);

            arr[j+1] = arr[j];
            j -= 1;
        }
        arr[j+1] = curr;
    }

    display("green", arr);

    cntSlider.style.visibility = "visible";
    shuffleButton.disabled = false;
}

async function heapSort(arr)  {
    function heapify(arr, n, i) {
        operations++;
        
        let largest = i;
        let l = (2*i) + 1;
        let r = (2*i) + 2;
        if (l < n && arr[l] > arr[i])   {
            largest = l;
        }
        if(r < n && arr[r] > arr[largest])  {
            largest = r;
        }

        if (largest != i)  {
            curr = arr[i];
            arr[i] = arr[largest];
            arr[largest] = curr;

            heapify(arr, n, largest);
        }
    }

    cntSlider.style.visibility = "hidden";
    shuffleButton.disabled = true;

    let n = arr.length;
    for (let i=~~(n/2)-1; i >= 0; i--)  {
        heapify(arr, n, i);

        highlight("red", arr, arr[i], arr[i]);
        await sleep(speed);
    }

    for (let i=n-1; i > 0; i--)    {
        curr = arr[i];
        arr[i] = arr[0];
        arr[0] = curr;

        heapify(arr, i, 0);

        highlight("red", arr, arr[i], arr[0]);
        await sleep(speed);
    }

    display("green", arr)

    cntSlider.style.visibility = "visible";
    shuffleButton.disabled = false;
}

async function quickSort(arr)  {
    let temp = arr.slice();
    async function partition(arr, lo, hi) {
        let i = lo - 1;
        let pivot = arr[hi];

        for (let j = lo; j < hi; j++)   {
            if (arr[j] < pivot) {
                i++;

                curr = arr[i];
                arr[i] = arr[j];
                arr[j] = curr;

                operations++;
            }
        }
        curr = arr[i+1];
        arr[i+1] = arr[hi];
        arr[hi] = curr;

        highlight("red", arr, arr[i+1], arr[curr]);
        await sleep(speed);

        return i+1;
    }

    async function helper(arr, lo, hi)    {
        if (lo < hi)    {
            pi = await partition(arr, lo, hi);

            await helper(arr, lo, pi-1);
            await helper(arr, pi+1, hi);
        }
    }
    
    cntSlider.style.visibility = "hidden";
    shuffleButton.disabled = true;

    await helper(arr, 0, arr.length-1);

    display("green", arr);

    cntSlider.style.visibility = "visible";
    shuffleButton.disabled = false;
}

async function mergeSort(arr)  {
    let fullArr = arr.slice();
    async function helper(arr)    {
        if (arr.length === 1)   {
            return arr[0];
        }

        let mid = ~~(arr.length / 2);
        let l = arr.slice(0, mid);
        let r = arr.slice(mid);

        await helper(l);  
        await helper(r);

        let i = j = k = 0;
        while (i < l.length && j < r.length)    {
            if (l[i] < r[j])    {
                arr[k] = l[i];
                i++;
            } else  {
                arr[k] = r[j];
                j++;
            }
            k++;

            operations++;
        }

        while (i < l.length)    {
            arr[k] = l[i];
            i++;
            k++;

            operations++;
        }

        while (j < r.length)    {
            arr[k] = r[j];
            j++;
            k++;

            operations++;
        }

        fullArr = arr.concat(fullArr.slice(arr.length-1));
        highlight("red", fullArr, fullArr[k], fullArr[k]);
        await sleep(speed);
    }

    cntSlider.style.visibility = "hidden";
    shuffleButton.disabled = true;

    await helper(arr);
    display("green", arr);
    
    cntSlider.style.visibility = "visible";
    shuffleButton.disabled = false;
}

async function bucketSort(arr)  {
    function insertionSort(arr) {
        for (let i = 1; i < arr.length; i++)    {
            let j = i-1;
            let curr = arr[i];
            while (j >= 0 && curr < arr[j]) {
                arr[j+1] = arr[j];
                j -= 1;

                operations++;
            }
            arr[j+1] = curr;

            operations++;
        }
        return arr;
    }

    cntSlider.style.visibility = "hidden";
    shuffleButton.disabled = true;

    let buckets = [[],[],[],[]];

    for (let i=0; i < arr.length; i++)   {
        let ind = ~~(arr[i] / 150);
        buckets[ind].push(arr[i]);

        operations++;
    }

    for (let i=0; i < buckets.length; i++)  {
        buckets[i] = insertionSort(buckets[i]);

        operations++;
    }
    
    let k = 0;
    for (let i=0; i < buckets.length; i++)  {
        for (let j=0; j < buckets[i].length; j++)   {
            arr[k] = buckets[i][j];
            k++;

            highlight("red", arr, arr[k], arr[k]);
            await sleep(speed);
        }
    }

    display("green", arr);

    cntSlider.style.visibility = "visible";
    shuffleButton.disabled = false;
}

async function radixSort(arr)  {
    let iter = 0;
    async function countingSort(arr, exp)  {
        if (iter === 4)  {
            return;
        }

        let output = new Array(arr.length).fill(0);
        let cnt = new Array(10).fill(0);
        for (let i=0; i < arr.length; i++)   {
            let ind = ~~(arr[i] / exp);
            cnt[ind % 10]++;

            operations++;
        }

        for (let i=1; i < cnt.length; i++)  {
            cnt[i] += cnt[i-1];

            operations++;
        }

        let j = arr.length-1;
        while (j >= 0)  {
            let ind = ~~(arr[j] / exp);
            output[cnt[ind % 10] - 1] = arr[j];
            cnt[ind % 10]--;
            j--;

            highlight("red", arr, arr[cnt[ind % 10] - 1], arr[j]);
            await sleep(speed);
        }
        iter++;

        arr = output;
        return arr;
    }

    cntSlider.style.visibility = "hidden";
    shuffleButton.disabled = true;

    let maxNum = Math.max(...arr);
    let exp = 1;
    while (maxNum / exp > 0 && iter < 4)    {
        arr = await countingSort(arr, exp);
        exp *= 10;

        operations++;
    }

    display("green", arr);
    
    cntSlider.style.visibility = "visible";
    shuffleButton.disabled = false;
}

async function countingSort(arr)  {
    cntSlider.style.visibility = "hidden";
    shuffleButton.disabled = true;

    let temp = arr.slice();
    let cnt = new Array(600).fill(0);
    for (let i=0; i < arr.length; i++)    {
        cnt[arr[i]]++;

        operations++;
    }

    for (let i=1; i < cnt.length; i++)  {
        cnt[i] += cnt[i-1];

        operations++;
    }

    for (let i=0; i < temp.length; i++)   {
        arr[cnt[temp[i]]-1] = temp[i];
        cnt[temp[i]]--;

        highlight("red", arr, arr[cnt[temp[i]]-1], arr[cnt[temp[i]]-1]);
        await sleep(speed);
    }

    display("green", arr);
    
    cntSlider.style.visibility = "visible";
    shuffleButton.disabled = false;
}

//Toggle Sorts
function toggle()   {
    document.getElementById("sortDropdown").classList.toggle("show");
}

//Filter Search of Sorts (https://www.w3schools.com/howto/howto_js_dropdown.asp)
function filter()   {
    let input = document.getElementById("search");
    let filt = input.value.toLowerCase();
    let contents = document.getElementById("sortDropdown");
    let sorts = contents.getElementsByTagName("button");
    for (let i=0; i < sorts.length; i++)    {
        let txt = sorts[i].textContent;
        if (txt.toLowerCase().indexOf(filt) > -1)   {
            sorts[i].style.display = "";
        } else  {
            sorts[i].style.display = "none";
        }
    }
}

//Driver Code
let name = document.getElementById("select");

document.getElementById("selectionSort").addEventListener("click", function ()  {
    name.innerHTML = "Selection Sort!";
    operations = 0;
    toggle();
});

document.getElementById("bubbleSort").addEventListener("click", function ()  {
    name.innerHTML = "Bubble Sort!";
    operations = 0;
    toggle();
});

document.getElementById("insertionSort").addEventListener("click", function ()  {
    name.innerHTML = "Insertion Sort!";
    operations = 0;
    toggle();
});

document.getElementById("heapSort").addEventListener("click", function ()  {
    name.innerHTML = "Heap Sort!";
    operations = 0;
    toggle();
});

document.getElementById("quickSort").addEventListener("click", function ()  {
    name.innerHTML = "Quick Sort!";
    operations = 0;
    toggle();
});

document.getElementById("mergeSort").addEventListener("click", function ()  {
    name.innerHTML = "Merge Sort!";
    operations = 0;
    toggle();
});

document.getElementById("bucketSort").addEventListener("click", function ()  {
    name.innerHTML = "Bucket Sort!";
    operations = 0;
    toggle();
});

document.getElementById("radixSort").addEventListener("click", function ()  {
    name.innerHTML = "Radix Sort!";
    operations = 0;
    toggle();
});

document.getElementById("countingSort").addEventListener("click", function ()  {
    name.innerHTML = "Counting Sort!";
    operations = 0;
    toggle();
});

//Start Button Functionality
let startButton = document.getElementById("start");
startButton.addEventListener("click", async function ()  {
    startButton.disabled = true;

    if (name.innerHTML === "Selection Sort!") {
        await selectionSort(arr);
    } else if (name.innerHTML === "Bubble Sort!")    {
        await bubbleSort(arr);
    } else if (name.innerHTML === "Insertion Sort!")  {
        await insertionSort(arr);
    } else if (name.innerHTML === "Heap Sort!")   {
        await heapSort(arr);
    } else if (name.innerHTML === "Quick Sort!")  {
        await quickSort(arr);
    } else if (name.innerHTML === "Merge Sort!")  {
        await mergeSort(arr);
    } else if (name.innerHTML === "Bucket Sort!") {
        await bucketSort(arr);
    } else if (name.innerHTML === "Radix Sort!")  {
        await radixSort(arr);
    } else if (name.innerHTML === "Counting Sort!")   {
        await countingSort(arr);
    }

    startButton.disabled = false;
});