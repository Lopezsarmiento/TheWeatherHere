'use strict';

getData();

async function getData() {
    const response = await fetch('/list/api');
    const data = await response.json();
    console.log(data);

    for (const item of data) {
        const root = document.createElement('div');
        const geo = document.createElement('h4');
        const date = document.createElement('h4');
        const img = document.createElement('img');

        const dateString = new Date(item.timestamp).toLocaleString();
        date.textContent = `${dateString}`;
        geo.textContent = `${item.lat}, ${item.lon}`;
        img.src = `${item.image64}`;

        root.append(geo, date, img);
        const list = document.getElementById('list');
        list.append(root);

    }
}