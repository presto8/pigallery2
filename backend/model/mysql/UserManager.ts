import {UserDTO, UserRoles} from "../../../common/entities/UserDTO";
import {IUserManager} from "../interfaces/IUserManager";
import {UserEntity} from "./enitites/UserEntity";
import {MySQLConnection} from "./MySQLConnection";

export class UserManager implements IUserManager {

  constructor() {
  }


  public async findOne(filter: any) {
    const connection = await MySQLConnection.getConnection();
    const user = (await connection.getRepository(UserEntity).findOne(filter));
    if (user.permissions && user.permissions != null) {
      user.permissions = <any>JSON.parse(<any>user.permissions);
    }
    return user;

  };

  public async find(filter: any) {
    const connection = await MySQLConnection.getConnection();
    return (await connection.getRepository(UserEntity).find(filter)).map(user => {
      if (user.permissions && user.permissions != null) {
        user.permissions = <any>JSON.parse(<any>user.permissions);
      }
      return user;
    });
  }

  public async createUser(user: UserDTO) {
    const connection = await MySQLConnection.getConnection();
    if (user.permissions && user.permissions != null) {
      user.permissions = <any>JSON.stringify(<any>user.permissions);
    }
    return await connection.getRepository(UserEntity).persist(user);
  }

  public async deleteUser(id: number) {
    const connection = await MySQLConnection.getConnection();
    const user = await connection.getRepository(UserEntity).findOne({id: id});
    return await connection.getRepository(UserEntity).remove(user);
  }

  public async changeRole(id: number, newRole: UserRoles) {

    const connection = await MySQLConnection.getConnection();
    let userRepository = connection.getRepository(UserEntity);
    const user = await userRepository.findOne({id: id});
    user.role = newRole;
    return await userRepository.persist(user);

  }

  public async changePassword(request: any) {
    throw new Error("not implemented"); //TODO: implement
  }

}