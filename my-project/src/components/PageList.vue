<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                <div class="list-group">
                    <a class="list-group-item" href="#/page1">Page1</a>
                    <a class="list-group-item" href="#/page2">Page2</a>
                    <a class="list-group-item" href="#/page3">Page3</a>
                    <a class="list-group-item" href="#/page4">Page4</a>
                </div>
            </div>
            <div class="col-md-9" id="app">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>