import React, { useState }  from "react";
// export const FirstFruit=()=> {
//     const [searchTerm, SetSearchTerm ] = useState("");
//     const fruits =[
//         "Apple",
//         "Banana",
//         "Peach",
//         "Avocado",
//         "Mango"
//     ];

//     const filteredFruits = fruits.filter((fruit)=>
//     fruit.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div>
//         <input type="text" placeholder="Search here..." 
//         value={searchTerm}
//         onChange={(e) => SetSearchTerm(e.target.value)}
//         />
//         <ul>
//             {filteredFruits.map((fruit, index) => (
//                 <li key={index}>{fruit}</li>
//             ))}
//         </ul>
//         </div>
//     );

// };
// export default FirstFruit;
// function MyButton({count, onClick}){
    
//     return(
//         <button  onClick={onClick}>
//             Pressed {count} times
//             </button>
//     );
    
// }

// export const FirstFruit=()=>{
//     const [count, setCount] = useState(0);
//     function handleOnClick(){
//         setCount(count+1);
//     }
//     return(
//         <>
//         <MyButton count={count} onClick={handleOnClick}/>
//         <MyButton count={count} onClick={handleOnClick}/>
//         </>
//     )
// }

const FirstFruit = () =>{
    // const products = [
    //     { title: 'Cabbage', id: 1 },
    //     { title: 'Garlic', id: 2 },
    //     { title: 'Apple', id: 3 },
    //   ];
    // const products = [
    //     { title: 'Cabbage', isFruit: false, id: 1 },
    //     { title: 'Garlic', isFruit: false, id: 2 },
    //     { title: 'Apple', isFruit: true, id: 3 },
    //   ];
    //   const ListedItem = products.map(product =>
    //     <li key={product.id}
    //     style={{
    //         color: product.isFruit ? ('blue') : ('red')
    //     }}
    //     >
    //         {product.title}
    //     </li> 
    //   )
    //   return(
    //     <>
    //     <ul>{ListedItem}</ul>
    //     </>
    //   );
    return(
        <button className="bott">X</button>
    );
}

export default FirstFruit;