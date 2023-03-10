import styles from "./Post.module.css"
import { Comment } from "./Comment";
import { Avatar } from "./Avatar"
import { formatDistanceToNow } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { Link } from "phosphor-react";
import { useState } from "react";

export function Post({ author, publishedAt, content }){
    const [comments, setComments] = useState([  /* Comentários e função para alterar eles */
        'Gostei muito, parabéns!!!',
    ])

    const publishedDateFormated = new Intl.DateTimeFormat('pt-BR',{
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    }).format(publishedAt)
        
    const publishedDateRelative = formatDistanceToNow(publishedAt, {
        locale: ptBR,
        addSuffix: true
    })

    const [newComment, setNewComment] = useState('') /* declarando o comentário novo como vazio */

    function newCommentChange(){
        event.target.setCustomValidity('') /* se não tiver isso, por causa da verificação de inválido não seria enviado nunca */
        setNewComment(event.target.value) /* Mudando o valor do comentário novo para o valor digitado na textarea */
    }

    function handleCreateNewComment(){
        event.preventDefault() /* impedir comportamento padrão do html de redirecionar */
        setComments([...comments, newComment]) /* Adcionando o comentário novo aos antigos */
        setNewComment('') /* Limpar a textarea */
    }

    function deleteComment(commentToDelete){
        const commentsWithoutDeletedOne = comments.filter(comment => { /* Seguindo o conceito de imutabilidade, estou criando um novo array de comentários sem aquele que foi deletado */
            return comment != commentToDelete
        })

        setComments(commentsWithoutDeletedOne)
    }

    function handleNewCommentInvalid(){
        event.target.setCustomValidity('Esse campo é obrigatório!') /* Alterar mensagem de erro (olhar função newCommentChange) */
    }

    const isNewCommentEmpty = newComment.length == 0

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={author.avatar}/>
                    <div className={styles.userInfo}>
                        <strong>{author.name}</strong>
                        <span>{author.role}</span>
                    </div>
                </div>

                <time title={publishedDateFormated} dateTime={publishedAt.toISOString()}>
                    {publishedDateRelative}
                </time>
            </header>

            <div className={styles.content}>
                {content.map(line => {
                    if(line.type == "paragraph"){
                        return <p key={line.content}>{line.content}</p>
                    }
                    else if(line.type == "link"){
                        return <p key={line.content}><a href="">{line.content}</a></p>
                    }
                    
                })}
            </div>


            <form onSubmit={handleCreateNewComment} className={styles.comentForm}>
                <strong> Deixe seu Feedback </strong>
        
                <textarea 
                    name="comment" 
                    placeholder="Deixe um comentário" 
                    onChange={newCommentChange} /* Ao digitar na textarea, chama essa função */
                    value={newComment}
                    required
                    onInvalid={handleNewCommentInvalid}/> 
                <footer>
                <button type="submit" disabled={isNewCommentEmpty} >Publicar</button>
                </footer>               {/* Não deixar enviar quando não tiver texto */}
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return <Comment key={comment} content={comment} onDeleteComment={deleteComment} /* passando a função como propriedade */ />
                })}
            </div>
        </article>
    )
}