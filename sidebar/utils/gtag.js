
// window.dataLayer = window.dataLayer || [];
// function gtag(){dataLayer.push(arguments);}


const open = () =>  {
    var gtag = window.gtag
    gtag('js', new Date());
    gtag('config', 'UA-114907566-1');
}


const close = () =>  {
    var gtag = window.gtag
    gtag('js', new Date());
    gtag('config', 'UA-117242473-1');
}

export default {
    open,
    close
}