# 作業說明
* 將Start.html在server上開啟就可以使用。
## 成果
**所有景點**
![](https://i.imgur.com/guf8bF2.png)

**選擇城市(台南)**
![](https://i.imgur.com/JKLdAiu.png)


## 排版架構

#### 說明：
* 上方button方button可以做功能切換。
* scroll list的寫法是建立**兩個div**，一個叫做scroll_list_outter另一個是list_inner，然後**固定outter**的大小，就可以把scroll的功能寫在上面，而**inner就是一個可以無限生長的div**。
* 內部的文字分為兩個部分，一個命名為output另一個命名為tail，然後都有**編號**，第一次要渲染出的output和tail分別命名為output_0和tail_0。output為會**印出頁面上的文字內容**，tail則為**預留給下一次**render要渲染的位置，**避免拉到底之後整個頁面全部刷新**。

*--還沒有拉到最底部時會渲染出以上敘述的物件。--*

* 拉到底後會在tail_0中渲染出output_1和tail_1，**一個包著一個依序生長下去**，直到最後一個tail中的內容會顯示資料底端。

## 程式說明
* 最外部的class是Start，內容是**顯示路由**以及在**左上角的功能選項**
* 內部一共有3個class：**InitShow**、**Show**、以及**Spot**。(InitShow和Show有兩個不同版本分別給全部景點和縣市景點使用，因為url不同)
* InitShow的功能是做**第一次的渲染**還有**判斷scroll list是否拉到底**而去做下一次的渲染。
* 判斷scroll list拉到底之後，會觸發**send_request**的函式，(InitShow中有一個state為**count**，用來**記錄目前為第幾次觸發**send_request)將**下一次要發送請求的網址以及count**數，丟入Show這個class之中。再由**Show去處理後續每一次拉到底後的渲染**。
* **Spot只有render**的功能，他會收到來自InitShow或是Show的參數後，丟出output與tail。
* **送出request**：這個功能寫在componentDidMount中，因為如果不這麼做，程式不會等到jsondata被取得，就自己先render東西出來，就永遠不會把jsondata寫入，所以在componentDidMount中等jsondata被讀入之後，因為發現內容物被更改(我把它寫在state的data中)，所以會再做一次render。
* **InitShow_City中有多一個componentDidUpdate**：因為如果點選不同的城市，不會被視為換了一個路由，只是裡面的props改變了，所以要在componentDidUpdate中再去重新抓一次jsondata
* **判斷最後一筆資料**：如果是最後一筆資料，取得的jsondata會為空，設一個bool叫做last判斷若jsondata為空就再也不送request。



