<template>
    <div id="articleWrapper">
        <h1>Hello my first article</h1>
        <h3>Build on github:</h3>
        <p>
            This article is an <mark>introduction</mark> of how I build this blog.
        </p>
        <p>
            First, log in on <i>github</i> and click <kbd>create a project</kbd>. If you want to use directly <a>username.github.io</a> as your website url,
            you need to set project's name as <strong>username.github.io</strong>.
            Otherwise you can name it randomly, then access it by the url <a>github.com/username/projectname</a>. (Notice that you need to change username and projectname with yours.)
        </p>
        <p>
            Second, create a directory in your own computer whose name is the same as the projectname. Then <code>git bash here</code> and input <code>git init</code> operation. Now notice,
            if your project name is <strong>username.github.io</strong>, you just do the following things in <i>master</i> branch. Otherwise, input <code>git checkout --orphan gh-pages</code>
            to <i>gh-pages</i> brand. It is ruled by github to use this branch to show your web pages of your project.
        </p>
        <p>
            Then, create your files of your blog. I do not use any model. I use vue to build the whole blog. And take any article like a component. Have not touched back-end things.
        </p>
        <h3>Set a customer domain for your website:</h3>
        <p>
            First you need to buy a domain name from <i>Domain Name Providers</i>. Here I choose <i>goDaddy</i> because I am now in Australia.
        </p>
        <p>
            After buying, you need to set DNS, including adding A record and CNAME record. You can find more information about this at <a href="">How to set DNS</a>.
        </p>
        <p>
            Finally, create a <strong>CNAME</strong> file which only contains one row code(your domain name). Notice that CNAME should be uppercase.
        </p>
        <h3>Puddles I steped:</h3>
        <p>
            To be continued.
        </p>
    </div>
</template>

<style scoped>
    div#articleWrapper{
        margin:0;
        padding:0;
    }
</style>