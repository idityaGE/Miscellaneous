package main

import (
	"fmt"
	"math"
)

func main() {
	fmt.Println(math.Pi)

	multiline := `
			Aditya
			Maurya
			20
			boy
			${Add}
	`
	name := "Aditya"
	fmt.Println(multiline)
	// String must be in double quotes
	// In single quote it will a diffrent data type (rune) --> quite similar like char
	fmt.Printf("%c\n",name[0])
	fmt.Printf("%v\n",name[0:3])
	fmt.Println(len(multiline))
	fmt.Println("Hello, my name is", name)

}
