import bcrypt from "bcryptjs";



interface credentialsType{
    username: string,
    password: string
}


export async function signup({username, password}: credentialsType){
    try{
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        // console.log("hashed password  :", hashedPassword)

        await prisma?.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        return {
            success: true,
            message: "Account created",
        }
    }
    catch (err){
        return { 
            success: false, 
            message: "Something went wrong. Please try again later."
        }
    }
}




export async function signin({username, password}: credentialsType){
    try{
        const userDetails  = await prisma?.user.findFirst({
            where: {
                username: username
            }
        })

        if(!userDetails){
            return { 
                success: false, 
                message: "User not found"
            }
        }

        const passwordMatch = bcrypt.compareSync(password, userDetails.password);

        if (!passwordMatch) {
            return { 
                success: false, 
                message: "Invalid credentials"
            };
        }
      
        return { 
            success: true, 
            message: "Login successful"
        };
    }
    catch(err){
        return { 
            success: false, 
            message: "Something went wrong. Please try again later."
        }
    }
}