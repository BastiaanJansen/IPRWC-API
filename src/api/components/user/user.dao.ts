import {
    EntityManager,
    getManager,
    getRepository,
    Repository,
    SelectQueryBuilder,
} from "typeorm";
import { CreateUserDTO } from "./dto/create-user.dto";
import bcrypt from "bcrypt";
import { User } from "./user.model";
import { UpdateUserDTO } from "./dto/update-user.dto";

export const findAll = async (): Promise<User[]> => {
    return await getRepository(User).find();
};

export const findByID = async (id: number): Promise<User | undefined> => {
    return await getRepository(User).findOne(id);
};

export const findByEmail = async (
    email: string,
    selectPassword: boolean = false
): Promise<User | undefined> => {
    const builder: SelectQueryBuilder<User> = await getRepository(
        User
    ).createQueryBuilder("user");
    builder.where("user.email = :email", { email });

    if (selectPassword) builder.addSelect("user.password");

    return builder.getOne();
};

export const create = async (dto: CreateUserDTO): Promise<User> => {
    dto.password = await bcrypt.hash(dto.password, 10);

    const user = new User();
    user.firstname = dto.firstname;
    user.lastname = dto.lastname;
    user.email = dto.email;
    user.password = dto.password;

    const createdUser = await getRepository(User).save(user);
    delete createdUser.password;
    return createdUser;
};

export const update = async (id: number, dto: UpdateUserDTO): Promise<User> => {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);

    return getManager().transaction(async (manager: EntityManager) => {
        const userRepository: Repository<User> = manager.getRepository(User);

        await userRepository.save({
            id,
            firstname: dto.firstname,
            lastname: dto.lastname,
            email: dto.email,
            password: dto.password,
        });

        const user = await userRepository.findOne(id);
        return user!;
    });
};
